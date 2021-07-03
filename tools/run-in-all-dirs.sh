#!/bin/sh

for fname in ./*/pyproject.toml; do
  dname=$(dirname $fname)
  cd $dname
  eval "$@"
  cd ../
done
