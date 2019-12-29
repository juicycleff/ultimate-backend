#!/usr/bin/env bash

ARRAYS_STRING=$(jq -r '.projects[].root' ./nest-cli.json)
read -r -a PROJECTS <<< "${ARRAYS_STRING}"

echo "Service and Library build system started"

for VAR in "${PROJECTS[@]}" ; do
  echo "Building for" "${VAR:5}"
  npx nest build "${VAR:5}"
done

echo "Service and Library build system completed"
