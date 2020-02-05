#!/bin/bash

ARRAYS_STRING=$(jq -r '.projects[].root' ./nest-cli.json)
IFS=$'\n' read -r -a PROJECTS <<< "${ARRAYS_STRING}"
echo "Rolling back kubernertes deployment started"

for VAR in "${PROJECTS[@]}" ; do
  echo "Building for" "${VAR:5}"
  kubectl rollout undo deployments/"${VAR:5}" -n development
done

echo "Rolling back kubernertes deployment completed"
