#!/bin/sh

for fname in ./packages/*/pyproject.toml; do
  dname=$(dirname $fname)
  cd $dname
  eval "$@"
  cd ../../
done
