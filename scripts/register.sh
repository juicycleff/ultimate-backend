#!/bin/bash
# shellcheck disable=SC2207
PROJECTS=$(jq -r '.projects[] | select(.type == "application") | .root' ./nest-cli.json)
BOOTSTRAP_PATH=src/bootstrap-development.yaml
CONFIG_PATH=config.example

echo "Service Registration system started"

for PROJECT_DIR in ${PROJECTS} ; do
  if [ ! -f "./${PROJECT_DIR}/${BOOTSTRAP_PATH}" ]; then
    echo "./${PROJECT_DIR}/${BOOTSTRAP_PATH} not found, skipping service"
    continue
  fi

  SVC_NAME=$(yq r ./"${PROJECT_DIR}"/${BOOTSTRAP_PATH} 'service.name' )
  echo "Registering ${SVC_NAME}"

  if [ ! -f "./${PROJECT_DIR}/${CONFIG_PATH}" ]; then
    echo "./${PROJECT_DIR}/${CONFIG_PATH} not found, skipping service"
    continue
  fi

    echo "**** ${PROJECT_DIR}"

  consul kv put ultimatebackend/config/"${SVC_NAME}" \@./"${PROJECT_DIR}"/${CONFIG_PATH}
done

echo "Service Registration system completed"
