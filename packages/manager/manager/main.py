import asyncio, tempfile, os, json, logging
# import yaml
# import docker
# import nanoid
import zmq
from zmq.asyncio import Context
# from api_types_py import Task

# async def clone_component(comp: Component, path: str):
#     repo_path = os.path.join(path, comp.name)
#     logging.info("Cloning", comp.name)
#     proc = await asyncio.create_subprocess_shell(f"git clone {comp.source_url} {repo_path}")
#     await proc.wait()
#     return repo_path

# async def deploy_single(id: str, comp: Component):
#     with tempfile.TemporaryDirectory() as tmpdir:
#         repo_path = await clone_component(comp, tmpdir)

#         os.mkdir(f'./data/input/{comp.name}')
#         with open(f'./data/input/{comp.name}/input.json') as f:
#             json.dump(comp.inputs, f)

#         services = {
#             comp.name: {
#                 'build': { 'context':  repo_path },
#                 'ports': [f"{comp.port}:{comp.port}"],
#                 'volumes': [
#                     f'./data/{comp.name}/input:/input',
#                     f'./data/{comp.name}/output:/output'
#                 ]
#             }
#         }
#         compose_dict = {
#             'version': '3.7',
#             'services': services
#         }

#         with open(os.path.join(tmpdir, 'docker-compose.yml'), 'w') as f:
#             yaml.dump(compose_dict, f)

#         logging.info("Running compose up")
#         logging.info(yaml.dump(compose_dict))
#         proc = await asyncio.create_subprocess_shell(f"cd {tmpdir}; docker-compose up --build -p dp-agent")
#         await proc.wait()

# def deploy_comp(comp: Component):
#     newid = nanoid.generate(size=8)
#     asyncio.create_task(deploy_single(newid, comp))
#     return newid

context = Context.instance()

async def main():
    socket = context.socket(zmq.REP)
    socket.connect("tcp://localhost:5555")
    while True:
        msg = await socket.recv_json()
        print("received", msg)
        await socket.send_json({ "res": "hello" })

if __name__ == "__main__":
    asyncio.run(main())
