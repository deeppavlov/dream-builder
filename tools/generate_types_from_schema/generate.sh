#!/bin/sh

cd tools/generate_types_from_schema
pnpm exec json2ts -i ../../schema -o ../../ts/packages/api-types --cwd ../../schema
poetry run datamodel-codegen --input ../../schema --input-file-type jsonschema --output ../../py/api_types

cd ../../ts/packages/api-types
rm index.d.ts
for filename in *.d.ts; do
  echo "export * from './${filename::-5}';" >> index.d.ts
done
