#!/bin/bash
# shellcheck disable=SC2207
PROJECTS=$(jq -r '.projects[].root' ./nest-cli.json)

echo "Service and Library build system started"

for VAR in ${PROJECTS} ; do
  echo "Building for" "${VAR}"
  npx nest build "${VAR}"
done

echo "Service and Library build system completed"
