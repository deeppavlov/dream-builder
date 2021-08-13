from typing import Optional, List, Any, Dict
import asyncio, tempfile, os, json, logging
from pathlib import Path

import shutil
import yaml
import aiohttp
from fastapi import FastAPI
from pydantic import BaseModel
from deeppavlov import build_model, train_model
from deeppavlov.core.common.file import read_json

class Component(BaseModel):
    type: str
    label: Optional[str] = None

class TrainingRequest(BaseModel):
    training_id: str
    component_id: str
    component: Component
    data: Dict[str, List[Dict[str, Any]]]

class InteractMsg(BaseModel):
    msg: List[str]

logging.basicConfig(level=logging.INFO)

GITREMOTE = "http://localhost:8888"
APISERVER = "http://localhost:8000"

http_client: Optional[aiohttp.ClientSession] = None
def get_http_client() -> aiohttp.ClientSession:
    global http_client
    if http_client is None:
        http_client = aiohttp.ClientSession()
    return http_client

def on_startup():
    get_http_client()

async def on_shutdown():
    global http_client, docker_client
    if http_client is not None:
        await http_client.close()
        http_client = None

def get_gobot_stories(flow):
    def recurse(source_id: str, steps: List[str]):
        stories = []
        steps = [*steps, source_id]
        is_last = True
        for el in flow:
            if 'source' in el and el['source'] == source_id:
                stories += recurse(el['target'], steps)
                is_last = False
        if is_last:
            return [steps]
        return stories

    def find_starts():
        all_nodes = set()
        for el in flow:
            if 'type' in el:
                all_nodes.add(el['id'])
        for el in flow:
            if 'target' in el and el['target'] in all_nodes:
                all_nodes.remove(el['target'])
        return all_nodes

    starts = find_starts()
    stories = []
    for start in starts:
        stories += recurse(start, [])
    nodes = { n['id']: n for n in flow if 'type' in n }

    out_stories = []
    resp_idx = 0
    responses = dict()
    for i, story in enumerate(stories):
        steps = []
        for step_id in story:
            node = nodes[step_id]
            if node['type'] == 'utterance':
                steps.append({ 'intent': node['data']['selectedIntent'] })
            # if node['type'] == 'apicall':
            #     steps.append({ 'intent': node['data']['selectedIntent'] })
            if node['type'] == 'response':
                resp = node['data']['respStr']
                if resp not in responses:
                    responses[resp] = f"system_{resp_idx}"
                    resp_idx += 1
                steps.append({ 'action': responses[resp] })
        out_story = { 'story': f"story_{i}", 'steps': steps }
        out_stories.append(out_story)

    stories_cont = { 'stories': out_stories }
    responses = {  name: [{'text': resp}]  for resp, name in responses.items() }
    actions = list(responses.keys())
    return stories_cont, responses, actions



def _write_yml(content, path, pipe_style=False):
    default_style = "|" if pipe_style else None
    with open(path, "w") as yml_f:
        yaml.dump(content, yml_f, default_style=default_style)
        logging.info(f"Writing yaml at {path}:\n" + yaml.dump(content, default_style=default_style))


def write_nlu(nlu_content, path):
    content = {"nlu": nlu_content, "version": "2.0"}
    _write_yml(content, path, pipe_style=True)


def write_domain(domain_content, path):
    domain_content["version"] = "2.0"
    _write_yml(domain_content, path)


def write_stories(content, path):
    path = Path(path)
    _write_yml(content, path)
    _write_yml(content, path.with_name(f"{path.stem}-trn{path.suffix}"))
    _write_yml(content, path.with_name(f"{path.stem}-tst{path.suffix}"))
    _write_yml(content, path.with_name(f"{path.stem}-val{path.suffix}"))

model_cache = {}

async def poll_gobot():
    client = get_http_client()
    while True:
        try:
            async with client.get("http://localhost:5000/probe") as req:
                _ = await req.read()
                return
        except aiohttp.ClientOSError:
            pass
        except aiohttp.ClientConnectionError:
            pass

async def _train_single(training: TrainingRequest):
    with tempfile.TemporaryDirectory() as tmpdir:
        trainid = training.training_id

        datadir = os.path.join(tmpdir, "data", trainid)
        if os.path.exists(datadir):
            shutil.rmtree(datadir)
        os.makedirs(datadir)

        conf_path = os.path.join("components", training.component.type, "component", "config.json")
        conf = read_json(conf_path)
        conf['dataset_reader']['data_path'] = os.path.abspath(datadir)

        logging.info("Input data: \n" + json.dumps(training.data))
        if len(training.data) > 0:
            with open(os.path.join(datadir, "input.json"), "w") as f:
                json.dump(training.data, f)

            domain_content = { 'actions': [], 'intents': [], 'responses': {} }
            nlu_intents = []
            stories_content = None

            for res_type, resources in training.data.items():
                if res_type == 'intent':
                    for int in resources:
                        intent_name = int['name'].strip() # extra whitespace freaks the IC out
                        intent_examples = "\n".join([ ex.strip() for ex in int['examples'] ])

                        nlu_intents.append({"intent": intent_name, "examples": intent_examples})
                        domain_content['intents'].append(intent_name)
                if res_type == 'flow':
                    flow = resources[0]['el']
                    stories_content, responses, actions = get_gobot_stories(flow)
                    domain_content['responses'] = responses
                    domain_content['actions'] = actions

            if training.component.type in ["intent_catcher", "gobot"]:
                if stories_content is None:        
                    stories_content = []
                    for intent_name in domain_content['intents']:
                        stories_content.append({"story": "randomstory", "steps": [{"intent": intent_name},
                            {"action": "system_bye"}]})
                write_nlu(nlu_intents, os.path.join(datadir, "nlu.yml"))
                write_domain(domain_content, os.path.join(datadir, "domain.yml"))
                write_stories(stories_content, os.path.join(datadir, "stories.yml"))

            if training.component.type == "intent_catcher":
                pipe = conf['chainer']['pipe']
                for comp in pipe:
                    if 'number_of_intents' in comp:
                        comp['number_of_intents'] = len(nlu_intents)

        logging.info(f"Initializing {training.component.type}:\n {json.dumps(conf, indent=4)}")
        if training.component.type == "intent_catcher":
            model = build_model(conf, download=True)
            model = train_model(conf) # type: ignore
            model_cache[trainid] = model
        elif training.component.type == "gobot":
            kill_proc = await asyncio.create_subprocess_shell(f"docker kill gobot")
            await kill_proc.wait()
            rm_proc = await asyncio.create_subprocess_shell(f"docker container rm gobot")
            await rm_proc.wait()
            train_proc = await asyncio.create_subprocess_shell(f"docker run --gpus all --name gobot -v {os.path.abspath(datadir)}:/input -p 5000:5000 -d gobot-runner")
            await train_proc.wait()
            if train_proc.returncode != 0:
                raise RuntimeError("Failed to start gobot")
            await asyncio.wait_for(poll_gobot(), timeout=300)

        logging.info(f"Reporting {trainid} as done")
        client = get_http_client()
        async with client.put(f"{APISERVER}/components/{training.component_id}/training/{trainid}", json={"status": "success"}) as resp:
            if resp.status != 200:
                raise RuntimeError("Falied to update component status")

async def train_single(training: TrainingRequest):
    try:
        await _train_single(training)
    except Exception as e:
        client = get_http_client()
        async with client.put(f"{APISERVER}/components/{training.component_id}/training/{training.training_id}", json={"status": "failed"}) as resp:
            if resp.status != 200:
                raise RuntimeError("Falied to update component status")
        raise e

def get_model(comptype: str, trainid: str):
    if trainid not in model_cache:
        conf_path = os.path.join("components", comptype, "component", "config.json")
        conf = read_json(conf_path)
        model_cache[trainid] = build_model(conf)
    return model_cache[trainid]

app = FastAPI()
app.add_event_handler("shutdown", on_shutdown)

@app.post("/trainings")
async def post_training(training: TrainingRequest):
    logging.info("Deploying\n" + json.dumps(training.dict()))
    asyncio.create_task(train_single(training))

@app.post("/interact/{comptype}/{trainid}")
async def post_interact(comptype:str, trainid: str, msg: InteractMsg):
    model = get_model(comptype, trainid)
    [a, b] = model(msg.msg)
    return [a, b.tolist()]
