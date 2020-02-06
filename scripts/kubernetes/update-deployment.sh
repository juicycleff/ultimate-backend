#!/bin/bash
# shellcheck disable=SC2207
PROJECTS=( $(jq -r '.projects[].root' ./nest-cli.json) )

echo "Rolling update kubernetes deployment started"

for VAR in "${PROJECTS[@]}" ; do
    if [[ "$VAR" == apps/* ]];then
        appStr=${VAR}
        echo "Building for" "${appStr:5}"
        kubectl set image deployments/"${appStr:5}" "${appStr:5}"="${appStr:5}":"${IMAGE_TAG:?Variable not set or empty}" -n "${NAMESPACE:?Variable not set or empty}"
        kubectl rollout status deployments/"${appStr:5}" -n "${NAMESPACE:?Variable not set or empty}"
    fi
done

echo "Rolling update kubernetes deployment completed"
