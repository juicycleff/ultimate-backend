#!/bin/bash
# shellcheck disable=SC2207
PROJECTS=( $(jq -r '.projects[].root' ./nest-cli.json) )

echo "Rolling back kubernertes deployment started"

for VAR in "${PROJECTS[@]}" ; do
  echo "Building for" "${VAR:5}"
  kubectl rollout undo deployments/"${VAR:5}" -n development
done

echo "Rolling back kubernertes deployment completed"
