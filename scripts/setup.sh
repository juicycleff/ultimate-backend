#!/usr/bin/env bash

PROJECTS=( "$(cat ./nest-cli.json | jq -r '.projects[].root')")

echo "Service and Library build system started"

for VAR in "${PROJECTS[@]}" ; do
  echo "Building for" "${VAR:5}"
  npx nest build "${VAR:5}"
done

echo "Service and Library build system completed"
