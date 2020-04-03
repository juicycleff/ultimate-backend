#!/bin/bash
# shellcheck disable=SC2207
PROJECTS=( $(jq -r '.projects[].root' ./nest-cli.json) )
# shellcheck disable=SC2206
declare -a APP_PROJECTS=( ${PROJECTS[@]/libs*/} )
declare -a SERVICES

for appStr in "${APP_PROJECTS[@]}"; do
  SERVICES+=( "${appStr:5}" )
done

SERVICES=($(printf '%s\n' "${SERVICES[@]}" | sort -r -n -k2))

echo "Rolling back kubernertes deployment started"

for VAR in "${SERVICES[@]}" ; do
  echo "Building for" "${VAR}"
  kubectl rollout undo deployments/"${VAR}" -n development
done

echo "Rolling back kubernertes deployment completed"
