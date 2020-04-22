#!/bin/bash
# shellcheck disable=SC2207
PROJECTS=( $(jq -r '.projects[] | select(.type == "application") | .root' ./nest-cli.json) )

echo "Service Registration system started"

for PROJECT_DIR in "${PROJECTS[@]}" ; do
  if [ ! -f "./${PROJECT_DIR}/src/bootstrap.yaml" ]; then
    echo "./${PROJECT_DIR}/src/bootstrap.yaml not found, skipping service"
    continue
  fi

  SVC_NAME=$(yq r ./${PROJECT_DIR}/src/bootstrap.yaml 'service.name' )
  echo "Registering ${SVC_NAME}"

  if [ ! -f "./${PROJECT_DIR}/config.example" ]; then
    echo "./${PROJECT_DIR}/config.example not found, skipping service"
    continue
  fi
  consul kv put ultimatebackend/config/${SVC_NAME} \@./${PROJECT_DIR}/config.example
done

echo "Service Registration system completed"
