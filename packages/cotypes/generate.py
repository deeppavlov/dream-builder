import subprocess, os, shutil, json
import black
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

def path2name(path: str):
    return ''.join(s.title() for s in path.split('_'))

py_schema_dict = {}
for schema_path in glob(os.path.join(SCHEMADIR, "*", "*.json")):
    schema_path = Path(schema_path)
    schema = json.load(open(schema_path))
    schema['$schema'] = "https://json-schema.org/draft/2020-12/schema"
    name = path2name(Path(schema_path).stem)
    schema['$id'] = name
    schema['title'] = name
    json.dump(schema, open(schema_path, 'w'), indent=4)

    if schema_path.parent.name == 'data':
        dat_type = schema_path.stem
        schema = json.load(open(schema_path))
        py_schema_dict[dat_type] = schema

with open(PYDIR / "data_schemas.py", "w") as f:
    code = f"schemas = {repr(py_schema_dict)}"
    formatted = black.format_str(code, mode=black.Mode())
    f.write(formatted)

for target in ["data", "common"]:
    py_out_dir = PYDIR / target
    _ensure_dir_empty(py_out_dir)

    generate(
        SCHEMADIR / target,
        input_file_type=InputFileType.JsonSchema,
        output=py_out_dir
    )

    res_types = [ '.'.join(n.split('.')[:-1]) for n in os.listdir(py_out_dir) if n != "__init__.py" ]
    py_exports = '\n'.join([ f"from .{r} import {path2name(r)}" for r in res_types ]) + '\n'
    py_all = ', '.join([ f"'{r}'" for r in res_types ])
    py_all = f"__all__ = [{py_all}]\n"

    with open(py_out_dir / "__init__.py", "w") as f:
        f.write(py_exports + py_all)

    ts_out_dir = TSDIR / target
    _ensure_dir_empty(ts_out_dir)

    subprocess.run(f"pnpm exec json2ts -i {SCHEMADIR / target} -o {ts_out_dir} --cwd {SCHEMADIR / target}".split(" "))

    for res in res_types:
        path = (ts_out_dir / res).with_suffix(".d.ts")
        with open(path) as f:
            cont = f.read()
        cont = cont.replace("  [k: string]: unknown;\n", "")
        with open(path, "w") as f:
            f.write(cont)

    ts_imports = '\n'.join([ f"import {{ {path2name(r)} }} from './{r}';" for r in res_types ]) + '\n'
    ts_exports = '\n'.join([ f"export {{ {path2name(r)} }} from './{r}';" for r in res_types ]) + '\n'
    if target == 'data':
        ts_exports +=  f"export type Data = {' | '.join([ path2name(r) for r in res_types ])};\n"

    with open(ts_out_dir / "index.d.ts", 'w') as f:
        f.write(ts_imports + ts_exports)
