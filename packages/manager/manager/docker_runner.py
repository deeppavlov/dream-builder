import asyncio, logging, json
import subprocess
import adapters
import aiohttp
from tempfile import TemporaryDirectory
from typing import Optional, List
from pathlib import Path

from adapters import store, get_component_data_adapter
from adapters.concurrent import export_component
from cotypes.common.training import Status
from cotypes.common import Component, Message
from cotypes.adapters import Resources
from cotypes.manager import ComponentRunner
from manager import agent

logger = logging.getLogger(__name__)

async def _log_stream(stream: asyncio.StreamReader, prefix: str = ""):  
    while True:
        line = await stream.readline()
        if not line:
            break
        logger.info(prefix + line.decode())


async def _run_cmd(cmd: str, cwd: Optional[Path] = None, log: bool = False, log_prefix: str = ""):
    if cwd is not None:
        cmd = f"cd {cwd}; {cmd}"
    proc = await asyncio.create_subprocess_shell(
        cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        )

    if log and proc.stdout and proc.stderr:
        await asyncio.wait([
            _log_stream(proc.stdout, log_prefix),
            _log_stream(proc.stderr, log_prefix)
        ])
    stdout, stderr = await proc.communicate()
    return (proc.returncode, stdout, stderr)


async def _poll_container(port: int):
    async with aiohttp.ClientSession() as client:
        while True:
            try:
                async with client.get(f"http://localhost:{port}/probe") as req:
                    await req.read()
                    return
            except aiohttp.ClientOSError:
                pass
            except aiohttp.ClientConnectionError:
                pass


# TODO: Port to aiodocker
# It requires the build context to be in a tar file -> add tar export option to adapters
class DockerRunner(ComponentRunner):
    """Interface for running components locally in docker containers
       
    Requires docker to be set up, and optionally the nvidia container runtime,
    for training and inference on GPUs.
    """

    def __init__(self):
        """Inits a DockerRunner.
            
        Raises a RuntimeError if docker is not set up correctly.
        """
        docker_ok = subprocess.call(['docker', 'run', '--rm', 'hello-world'], stdout=subprocess.PIPE)
        if docker_ok != 0:
            raise RuntimeError("Docker is not set up correctly on this system!")
        gpus_ok = subprocess.call(
            ['docker', 'run', '--rm', '--gpus', 'all', 'hello-world'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE)
        self.gpus = "--gpus all" if gpus_ok == 0 else ""


    async def start_training(self, training_hash: str, template_link: str, comp: Component, data: Resources) -> Status:
        """Builds the component in a container and runs a training. 

        The component is first exported to a temporary directory, then built and the
        resulting container is run. If finished successfully, the container is commited
        to a new image, tagged with the training hash. During training we try not to
        raise exceptions, and instead return a FAILED status.

        Args:
            training_hash: Unique hash of the training data.
            comp: The component to be trained.
            data: Training data in the format { [data_type]: [<data_items>] }

        Returns:
            The training status. Either SUCCESS or FAILED.
        """

        label = comp.label or comp.type
        with TemporaryDirectory() as tmpdir:
            tmpdir = Path(tmpdir)
            logger.info(f"Exporting data for training {label}")
            try:
                store.dump(template_link, tmpdir)
                await export_component(comp, data, tmpdir)
            except RuntimeError as e:
                logger.error(f"Error exporting {label}:\n{e}")
                return Status.FAILED

            img_name = f"{label}-train:{training_hash}"
            logger.info(f"Building image {img_name}")
            build_return, _, _ = await _run_cmd(
                f"docker build . --tag {img_name}",
                cwd=tmpdir,
                log=True,
                log_prefix=f"[BUILD {label}]    ")
            if build_return != 0:
                return Status.FAILED
            logger.info(f"Image {img_name} built")

            Adapter = get_component_data_adapter(comp.type)
            adapter = Adapter()
            if (tmpdir / "train.py").exists():
                train_command = "python train.py"
            elif hasattr(adapter, "train_cmd"):
                train_command = adapter.train_cmd # type:ignore
            else:
                train_command = "python -m deeppavlov train ./config.json"

        logger.info(f"Inspecting {img_name} to determing original command")
        ins_return, ins_out, ins_err = await _run_cmd(f"docker inspect {img_name}")
        if ins_return != 0:
            logger.error(f"Inspecting {img_name} failed:\n{ins_err.decode()}")
            return Status.FAILED
        logger.info(f"Inspect result of {img_name}: {ins_out.decode()}")
        original_cmd = json.loads(ins_out.decode())[0]['Config']['Cmd']
        logger.info(f"Original command of {img_name}: {original_cmd}")
        
        container_name = f"dp_manager_{training_hash}_training"
        logger.info(f"Running training in container {container_name}")
        train_return, _, _ = await _run_cmd(
            f"docker run {self.gpus} --name {container_name} {img_name} {train_command}",
            log=True,
            log_prefix=f"[TRAIN {label}]    ")
        if train_return != 0:
            return Status.FAILED
        logger.info(f"Training {training_hash} exited")

        trained_img_name = f"{label}-trained:{training_hash}"
        logger.info(f"Commiting trained container to image {trained_img_name}")
        commit_return, _, commit_err = await _run_cmd(f"docker commit --change='CMD {json.dumps(original_cmd)}' {container_name} {trained_img_name}")
        if commit_return != 0:
            logger.error(f"Commiting {label} failed:\n{commit_err.decode()}")
            return Status.FAILED

        logger.info(f"Deleting trained container {container_name}")
        commit_return, _, commit_err = await _run_cmd(f"docker rm {container_name}")
        if commit_return != 0:
            logger.error(f"Deleting {label} failed:\n{commit_err.decode()}")
            return Status.FAILED

        return Status.SUCCESS
        

    async def interact(self, training_hash: str, comp: Component, message_history: List[Message]) -> Message:
        """Sends a message to a trained component and returns the reply.
            
        """
        label = comp.label or comp.type
        cont_name = f"{label}-test-{training_hash}"

        logger.info(f"Executing ps to find running containers")
        ps_return, ps_out, ps_err = await _run_cmd('docker ps --format "{{.Names}}"')
        if ps_return != 0:
            raise RuntimeError(f"Docker ps failed: {ps_err.decode()}")
        running_containers = ps_out.decode().split('\n')
        logger.info(f"Running docker containers: {', '.join(running_containers)}")
        
        if cont_name not in running_containers:
            # Kill all previous versions
            for cont in running_containers:
                if cont.startswith(f"{label}-test-"):
                    logger.info(f"Stopping {cont}")
                    await _run_cmd(f"docker stop {cont}")

            image_name = f"{label}-trained:{training_hash}" # TODO: Use comp.trained_model_link instead.
            logger.info(f"Starting container {cont_name} from {image_name}")
            run_return, _, run_err = await _run_cmd(f"docker run {self.gpus} --name {cont_name} -P -d {image_name}")
            if run_return != 0:
                raise RuntimeError(f"Starting {label} failed:\n{run_err.decode()}")

        # With the -P flag all exposed ports are bound to a random port on the host.
        # We use docker inspect to find the bound host port. We assume the container
        # has only one exposed port.
        logger.info(f"Running inspect on {cont_name}")
        inspect_return, inspect_out, inspect_err = await _run_cmd(f"docker inspect {cont_name}")
        if inspect_return != 0:
            raise RuntimeError(f"Failed to inspect {label}:\n{inspect_err.decode()}")
        logger.info(f"Inspect output:\n{inspect_out.decode()}")
        cont_data = json.loads(inspect_out.decode())
        try:
            port_bindings = list(cont_data[0]['NetworkSettings']['Ports'].values())
            port = int(port_bindings[0][0]['HostPort'])
        except (IndexError, KeyError, ValueError):
            raise RuntimeError(f"Container {label} has not exposed any ports")
        logger.info(f"Found open port for {cont_name}: {port}")

        logger.info(f"Waiting for {cont_name} to start up")
        try:
            await asyncio.wait_for(_poll_container(port), timeout=300)
        except asyncio.TimeoutError:
            raise RuntimeError(f"Container {label} is not responding")

        msg = agent.get_agent_state(message_history)
        logger.info(f"Sending message to {cont_name}:\n{json.dumps(msg, indent=4)}")
        async with aiohttp.ClientSession() as client:
            # TODO: Don't assume the endpoint, should read it from pipeline_conf
            async with client.get(f"http://localhost:{port}/respond", json=msg) as req:
                response = await req.json()
                logger.info(f"Received reply from {cont_name}:\n{json.dumps(response, indent=4)}")
                formatted = agent.format_reply(comp, response)
                logger.info(f"Formatted reply from {cont_name}:\n{formatted.json(indent=4)}")
                return formatted
