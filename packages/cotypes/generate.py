import subprocess, os, shutil, json
from glob import glob
from pathlib import Path
from datamodel_code_generator import InputFileType, generate

def _ensure_dir_empty(dir_path: Path):
    if os.path.exists(dir_path):
        shutil.rmtree(dir_path)
    os.makedirs(dir_path)

TSDIR = Path("ts")
PYDIR = Path("cotypes")
SCHEMADIR = Path("schema")

for schema_path in glob(os.path.join(SCHEMADIR, "*", "*.json")):
    schema = json.load(open(schema_path))
    schema['$schema'] = "https://json-schema.org/draft/2020-12/schema"
    name = Path(schema_path).stem.capitalize()
    schema['$id'] = name
    schema['title'] = Path(schema_path).stem.capitalize()
    if schema['type'] == 'object':
        schema['additionalProperties'] = False
    json.dump(schema, open(schema_path, 'w'), indent=4)

for target in ["data", "common"]:
    py_out_dir = PYDIR / target
    _ensure_dir_empty(py_out_dir)

    generate(
        SCHEMADIR / target,
        input_file_type=InputFileType.JsonSchema,
        output=py_out_dir
    )

    res_types = [ '.'.join(n.split('.')[:-1]) for n in os.listdir(py_out_dir) if n != "__init__.py" ]
    py_exports = '\n'.join([ f"from .{r} import {r.capitalize()}" for r in res_types ]) + '\n'
    py_all = ', '.join([ f"'{r}'" for r in res_types ])
    py_all = f"__all__ = [{py_all}]\n"

    with open(py_out_dir / "__init__.py", "w") as f:
        f.write(py_exports + py_all)

    ts_out_dir = TSDIR / target
    _ensure_dir_empty(ts_out_dir)

    subprocess.run(f"pnpm exec json2ts -i {SCHEMADIR / target} -o {ts_out_dir} --cwd {SCHEMADIR / target}".split(" "))
    ts_imports = '\n'.join([ f"import {{ {r.capitalize()} }} from './{r}';" for r in res_types ]) + '\n'
    ts_exports = '\n'.join([ f"export {{ {r.capitalize()} }} from './{r}';" for r in res_types ]) + '\n'
    ts_resunion =  f"export type Resource = {' | '.join([ r.capitalize() for r in res_types ])};\n"

    with open(ts_out_dir / "index.d.ts", 'w') as f:
        f.write(ts_imports + ts_exports + ts_resunion)
