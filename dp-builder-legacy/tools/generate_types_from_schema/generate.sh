#!/bin/sh

cd tools/generate_types_from_schema
pnpm exec json2ts -i ../../schema -o ../../packages/api_types_ts --cwd ../../schema
poetry run datamodel-codegen --input ../../schema --input-file-type jsonschema --output ../../packages/api_types_py/api_types_py

cd ../../packages/api_types_ts
mv ResourceUnion.d.ts Resource.d.ts
rm index.d.ts
for filename in *.d.ts; do
  echo "export * from './${filename::-5}';" >> index.d.ts
done
