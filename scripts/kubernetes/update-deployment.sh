#!/bin/bash
# shellcheck disable=SC2207
PROJECTS=( $(jq -r '.projects[].root' ./nest-cli.json) )
# shellcheck disable=SC2206
declare -a APP_PROJECTS=( ${PROJECTS[@]/libs*/} )
declare -a SERVICES

echo "Rolling update kubernetes deployment started"

for appStr in "${APP_PROJECTS[@]}"; do
  SERVICES+=( "${appStr:5}" )
done

SERVICES=($(printf '%s\n' "${SERVICES[@]}" | sort -r -n -k2))

if [ -z "${NAMESPACE}" ]; then
    NAMESPACE=production
fi

for VAR in "${SERVICES[@]}" ; do
    appStr=${VAR}
    echo "Building for" "${appStr}"
    kubectl set image deployments/"${appStr}" "${appStr}"="${appStr}":"${IMAGE_TAG:?Variable not set or empty}" -n "${NAMESPACE:?Variable not set or empty}"
    kubectl rollout status deployments/"${appStr}" -n "${NAMESPACE:?Variable not set or empty}"
done

echo "Rolling update kubernetes deployment completed"
