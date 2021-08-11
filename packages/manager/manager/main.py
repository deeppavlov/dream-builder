from typing import Optional, List
import asyncio, tempfile, os, json, logging
from pathlib import Path

import hashlib
import shutil
import yaml
import aiodocker
import aiohttp
from minio import Minio
from fastapi import FastAPI

from api_types_py import Component

logging.basicConfig(level=logging.INFO)

GITREMOTE = "http://localhost:8888"
APISERVER = "http://localhost:8000/api"

http_client: Optional[aiohttp.ClientSession] = None
def get_http_client() -> aiohttp.ClientSession:
    global http_client
    if http_client is None:
        http_client = aiohttp.ClientSession()
    return http_client

docker_client: Optional[aiodocker.Docker] = None
def get_docker_client() -> aiodocker.Docker:
    global docker_client
    if docker_client is None:
        docker_client = aiodocker.Docker()
    return docker_client

minio_client: Optional[Minio] = None
def get_minio_client() -> Minio:
    global minio_client
    if minio_client is None:
        minio_client = Minio("localhost:9000", access_key="minio", secret_key="minio123", secure=False)
    return minio_client

def on_startup():
    get_http_client()
    get_docker_client()
    get_minio_client()

async def on_shutdown():
    global http_client, docker_client
    if http_client is not None:
        await http_client.close()
        http_client = None
    if docker_client is not None:
        await docker_client.close()
        docker_client = None

async def clone_component(comp: Component, _: str):
    source = comp.content.source
    return os.path.abspath(os.path.join("components", source))
    # url = f"{GITREMOTE}/{comp.content.source}.git"
    # repo_path = os.path.join(path, source)
    # logging.info("Cloning", source)
    # proc = await asyncio.create_subprocess_shell(f"git clone {url} {repo_path}")
    # await proc.wait()
    # return repo_path

async def get_resources(resids: List[str]):
    client = get_http_client()

    async def fetch_res(resid: str):
        async with client.get(f"{APISERVER}/res/{resid}") as resp:
            res = await resp.json()
            return res

    requests = [ await fetch_res(r) for r in resids ]
    return requests

async def update_component_status(resid: str, new_stat: str):
    client = get_http_client()
    async with client.get(f"{APISERVER}/res/{resid}") as resp:
        res = await resp.json()
    async with client.put(f"{APISERVER}/res/{resid}/?disable_hooks=1", json={ **res, "content": { **res["content"], "status": new_stat } }) as resp:
        if resp.status != 200:
            raise RuntimeError("Falied to update component status")

def hash_file(path: str):
    sha1 = hashlib.sha1()
    with open(path, 'rb') as f:
        while True:
            data = f.read(65536)
            if not data:
                break
            sha1.update(data)
    sha1.hexdigest()


def _write_yml(content, path, pipe_style=False):
    default_style = "|" if pipe_style else None
    with open(path, "w") as yml_f:
        yaml.dump(content, yml_f, default_style=default_style)


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
    _write_yml(content, path.with_stem(f"{path.stem}-trn"))
    _write_yml(content, path.with_stem(f"{path.stem}-tst"))
    _write_yml(content, path.with_stem(f"{path.stem}-val"))


async def deploy_single(comp: Component):
    with tempfile.TemporaryDirectory() as tmpdir:
        repo_path = await clone_component(comp, tmpdir)
        comp_path = os.path.join(repo_path, "component")

        if os.path.exists(f"./data/{comp.resid}"):
            shutil.rmtree(f"./data/{comp.resid}")
        os.makedirs(f'./data/{comp.resid}/output')

        services = {
            "component": {
                'container_name': f"dp_agent_{comp.resid}",
                'build': { 'context':  comp_path },
                'ports': ["8014:8014"],
                'volumes': [
                    os.path.abspath(f'./data/{comp.resid}/output:/output')
                ]
            }
        }

        if comp.content.data is not None:
            os.makedirs(f'./data/{comp.resid}/input')
            inputs = await get_resources(comp.content.data)
            with open(f'./data/{comp.resid}/input/input.json', "w") as f:
                json.dump(inputs, f)

            nlu_content = []
            domain_content = []
            stories_content = []

            for res in inputs:
                if res['type'] == 'intent':
                    intent_name = res['content']['name']
                    intent_examples = "\n".join(res['content']['examples'])

                    nlu_content.append({"intent": intent_name, "examples": intent_examples})
                    domain_content.append(intent_name)
                    stories_content.append({"story": "randomstory", "steps": [{"intent": intent_name},
                                                                              {"action": "system_bye"}]})

                if res['type'] == 'link':
                    minio = get_minio_client()
                    tarpath = os.path.join(tmpdir, res['content']['link'])
                    minio.fget_object("models", res['content']['link'], tarpath)
                    shutil.unpack_archive(tarpath, f'./data/{comp.resid}/input')

            if comp.content.source in ["intent_catcher", "gobot"]:
                write_nlu(nlu_content, f'./data/{comp.resid}/input/nlu.yml')
                write_domain(domain_content, f'./data/{comp.resid}/input/domain.yml')
                write_stories(stories_content, f'./data/{comp.resid}/input/stories.yml')

            services["component"]["volumes"].append(os.path.abspath(f'./data/{comp.resid}/input:/input'))

        if comp.content.target is not None:
            services[comp.resid]['build']['target'] = comp.content.target

        compose_dict = {
            'version': '3.7',
            'services': services
        }

        with open(os.path.join(tmpdir, 'docker-compose.yml'), 'w') as f:
            yaml.dump(compose_dict, f)

        logging.info("Running compose up")
        logging.info(yaml.dump(compose_dict))
        proc = await asyncio.create_subprocess_shell(f"cd {tmpdir}; ls; docker-compose up --build")
        await proc.wait()
        logging.info(f"Component {comp.resid} exited")
        await update_component_status(comp.resid, "stopped")

        logging.info("listdir" + "\n".join(os.listdir(f'./data/{comp.resid}/output')))
        if len(os.listdir(f'./data/{comp.resid}/output')) > 0:
            tarpath = os.path.join(tmpdir, "compout")
            shutil.make_archive(tarpath, "tar", root_dir=f'./data/{comp.resid}/output')
            minio = get_minio_client()
            minio.fput_object("models", f"{comp.resid}_{hash_file('compout.tar')}", f"{tarpath}.tar")

            client = get_http_client()
            async with client.post(f"{APISERVER}/res", json={"type": "link", "resid": "", "content": { "link": f"{tarpath}.tar" }}) as resp:
                if resp.status != 200:
                    raise RuntimeError("Falied to post train result")

app = FastAPI(on_startup=[get_http_client], on_shutdown=[on_shutdown])

@app.post("/components", status_code=201)
async def deploy_comp(comp: Component):
    logging.info("Deploying\n" + json.dumps(comp.dict()))
    asyncio.create_task(deploy_single(comp))

@app.get("/components", response_model=List[str])
async def get_comps():
    docker = get_docker_client()
    comps = []
    async for cont in docker.containers.list():
        if cont.name.startswith("dp_agent_"):
            comps.append(cont.name.lstrip("dp_agent_"))
    return comps

@app.delete("/components/{id}")
async def kill_comp(id: str):
    docker = get_docker_client()
    cont = docker.containers.get(f"dp_agent_{id}")
    cont.kill()
