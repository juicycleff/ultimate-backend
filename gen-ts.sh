#! /bin/bash

# Path to this plugin
# PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"

# Directory to write generated code to (.js and .d.ts files)
# OUT_DIR="./libs/contracts/src/proto"

# protoc \
#     --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
#     --js_out="import_style=commonjs,binary:${OUT_DIR}" \
#     --ts_out="service=grpc-node:${OUT_DIR}" \
#     ./apps/service-*/src/proto/*.proto

SRC_DIR="./libs/proto-schema/src/proto/*.proto"
DEST_DIR="./libs/proto-schema/src"

protoc --plugin=node_modules/ts-proto/protoc-gen-ts_proto --ts_proto_opt=outputEncodeMethods=true,useEnumNames=false,asClass=false,outputJsonMethods=true,context=true,outputNestJs=true,outputClientImpl=false --ts_proto_out=${DEST_DIR} ${SRC_DIR}

# protobuf.js
# node_modules/.bin/pbjs \
# -t static-module \
# -w es6 \
# -k \
# -l \
# -p "${SRC_DIR}" \
# -o ${DEST_DIR}/rpc.js \
# "${SRC_DIR}"
#
# node_modules/.bin/pbts \
# -o ${DEST_DIR}/rpc.d.ts \
# ${DEST_DIR}/rpc.js
