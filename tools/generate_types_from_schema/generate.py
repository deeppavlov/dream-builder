import subprocess, os, shutil, json
from pathlib import Path
from datamodel_code_generator import InputFileType, generate

TSDIR = "packages/api_types_ts"
PYDIR = "packages/api_types_py"

if os.path.exists(PYDIR):
    shutil.rmtree(PYDIR)
subprocess.run(["poetry", "new", PYDIR, "-n", "-q"])

pyproject = ""
with open(PYDIR + "/pyproject.toml") as f:
    for l in f.readlines():
        if not l.startswith("python = "): pyproject += l
with open(PYDIR + "/pyproject.toml", 'w') as f:
    f.write(pyproject)

PYDIR += "/api_types_py"

generate(
    Path("./schema"),
    input_file_type=InputFileType.JsonSchema,
    output=Path(PYDIR)
)

res_types = [ '.'.join(n.split('.')[:-1]) for n in os.listdir(PYDIR) if n != "__init__.py" ]
py_exports = '\n'.join([ f"from .{r} import {r}" for r in res_types ]) + '\n'
py_all = ', '.join([ f"'{r}'" for r in res_types ])
py_all = f"__all__ = [{py_all}]\n"

with open(PYDIR + "/__init__.py", "w") as f:
    f.write(py_exports + py_all)

if os.path.exists(TSDIR):
    shutil.rmtree(TSDIR)
os.makedirs(TSDIR)
subprocess.run(["pnpm", "init", "-y"], cwd=TSDIR)

with open(TSDIR + "/package.json") as f:
    packagejson = json.load(f)
packagejson['name'] = "@dp-builder/api_types_ts"
with open(TSDIR + "/package.json", 'w') as f:
    json.dump(packagejson, f)

subprocess.run(f"pnpm exec json2ts -i schema -o {TSDIR} --cwd schema".split(" "))
if os.path.exists(TSDIR + "/Resource.d.ts"):
    os.remove(TSDIR + "/Resource.d.ts")

res_types = [ '.'.join(n.split('.')[:-2]) for n in os.listdir(TSDIR) if n.endswith('.d.ts') ]
ts_imports = '\n'.join([ f"import {{ {r} }} from './{r}';" for r in res_types ]) + '\n'
ts_exports = '\n'.join([ f"export {{ {r} }} from './{r}';" for r in res_types ]) + '\n'
ts_resunion =  f"export type Resource = {' | '.join(res_types)};\n"

with open(TSDIR + "/index.d.ts", 'w') as f:
    f.write(ts_imports + ts_exports + ts_resunion)
