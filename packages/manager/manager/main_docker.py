from typing import Optional, List, Any, Dict
import asyncio, tempfile, os, json, logging
from pathlib import Path

import shutil
import yaml
# import aiodocker
import aiohttp
from minio import Minio
from fastapi import FastAPI
from pydantic import BaseModel

from api_types_py import Component

class TrainingRequest(BaseModel):
    training_id: str
    component_id: str
    component: Component
    data: Dict[str, List[Dict[str, Any]]]

logging.basicConfig(level=logging.INFO)

GITREMOTE = "http://localhost:8888"
APISERVER = "http://localhost:8000"

http_client: Optional[aiohttp.ClientSession] = None
def get_http_client() -> aiohttp.ClientSession:
    global http_client
    if http_client is None:
        http_client = aiohttp.ClientSession()
    return http_client

# docker_client: Optional[aiodocker.Docker] = None
# def get_docker_client() -> aiodocker.Docker:
#     global docker_client
#     if docker_client is None:
#         docker_client = aiodocker.Docker()
#     return docker_client

minio_client: Optional[Minio] = None
def get_minio_client() -> Minio:
    global minio_client
    if minio_client is None:
        minio_client = Minio("localhost:9000", access_key="minio", secret_key="minio123", secure=False)
    return minio_client

def on_startup():
    get_http_client()
    # get_docker_client()
    get_minio_client()

async def on_shutdown():
    global http_client, docker_client
    if http_client is not None:
        await http_client.close()
        http_client = None
    # if docker_client is not None:
    #     await docker_client.close()
    #     docker_client = None


def _write_yml(content, path, pipe_style=False):
    default_style = "|" if pipe_style else None
    with open(path, "w") as yml_f:
        yaml.dump(content, yml_f, default_style=default_style)
        logging.info(f"Writing yaml at {path}:\n" + yaml.dump(content, default_style=default_style))


def write_nlu(nlu_content, path):
    content = {"nlu": nlu_content, "version": "2.0"}
    _write_yml(content, path, pipe_style=True)


def write_domain(domain_content, path):
    content = {"intents": domain_content, "version": "2.0"}
    _write_yml(content, path)


def write_stories(stories_content, path):
    content = {"stories": stories_content}
    path = Path(path)
    _write_yml(content, path)
    _write_yml(content, path.with_name(f"{path.stem}-trn{path.suffix}"))
    _write_yml(content, path.with_name(f"{path.stem}-tst{path.suffix}"))
    _write_yml(content, path.with_name(f"{path.stem}-val{path.suffix}"))


async def train_single(training: TrainingRequest):
    with tempfile.TemporaryDirectory() as tmpdir:
        trainid = training.training_id
        comp_path = os.path.abspath(os.path.join("components", training.component.type, "component"))

        datadir = os.path.join(tmpdir, "data", trainid)
        if os.path.exists(datadir):
            shutil.rmtree(datadir)
        os.makedirs(datadir)

        logging.info("Input data: \n" + json.dumps(training.data))
        if len(training.data) > 0:
            with open(os.path.join(datadir, "input.json"), "w") as f:
                json.dump(training.data, f)

            nlu_content = []
            domain_content = []
            stories_content = []

            for res_type, resources in training.data.items():
                if res_type == 'intent':
                    for int in resources:
                        intent_name = int['name'].strip() # extra whitespace freaks the IC out
                        intent_examples = "\n".join([ ex.strip() for ex in int['examples'] ])

                        nlu_content.append({"intent": intent_name, "examples": intent_examples})
                        domain_content.append(intent_name)
                        stories_content.append({"story": "randomstory", "steps": [{"intent": intent_name},
                                                                                  {"action": "system_bye"}]})
                if res_type == 'link':
                    for link in resources:
                        minio = get_minio_client()
                        tarpath = os.path.join(tmpdir, link['link'])
                        minio.fget_object("models", link['link'], tarpath)
                        shutil.unpack_archive(tarpath, datadir)

            if training.component.type in ["intent_catcher", "gobot"]:
                write_nlu(nlu_content, os.path.join(datadir, "nlu.yml"))
                write_domain(domain_content, os.path.join(datadir, "domain.yml"))
                write_stories(stories_content, os.path.join(datadir, "stories.yml"))

        base_img_name = f"{training.component.type}-train"
        logging.info(f"Building image {base_img_name}")
        build_proc = await asyncio.create_subprocess_shell(f"cd {comp_path}; docker build . --target train --tag {base_img_name}")
        await build_proc.wait()
        if build_proc.returncode != 0:
            raise RuntimeError("Build failed")
        logging.info(f"Image {base_img_name} built")
        
        container_name = f"dp_manager_{trainid}"
        logging.info(f"Running training in container {container_name}")
        train_proc = await asyncio.create_subprocess_shell(f"cd {tmpdir}; docker run --name {container_name} -v {os.path.abspath(datadir)}:/input {base_img_name}")
        await train_proc.wait()
        if train_proc.returncode != 0:
            raise RuntimeError("Train failed")
        logging.info(f"Training {trainid} exited")

        trained_img_name = f"{training.component.type}-trained:{trainid}"
        logging.info(f"Commiting trained container to image {trained_img_name}")
        commit_proc = await asyncio.create_subprocess_shell(f"docker commit {container_name} {trained_img_name}")
        await commit_proc.wait()
        if commit_proc.returncode != 0:
            raise RuntimeError("Commit failed")

        logging.info(f"Reporting {trainid} as done")
        client = get_http_client()
        async with client.put(f"{APISERVER}/components/training/{trainid}", json={"status": "success"}) as resp:
            if resp.status != 200:
                raise RuntimeError("Falied to update component status")

app = FastAPI(on_startup=[get_http_client], on_shutdown=[on_shutdown])

@app.post("/trainings")
async def post_training(training: TrainingRequest):
    logging.info("Deploying\n" + json.dumps(training.dict()))
    asyncio.create_task(train_single(training))

# @app.get("/components", response_model=List[str])
# async def get_comps():
#     docker = get_docker_client()
#     comps = []
#     async for cont in docker.containers.list():
#         if cont.name.startswith("dp_agent_"):
#             comps.append(cont.name.lstrip("dp_agent_"))
#     return comps

# @app.delete("/components/{id}")
# async def kill_comp(id: str):
#     docker = get_docker_client()
#     cont = docker.containers.get(f"dp_agent_{id}")
#     cont.kill()
