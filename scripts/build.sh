#!/bin/bash

# Common variables / functions
. ${PWD}/scripts/_common.sh

# Get worker list
WORKERS_DIR=${PWD}/workers
WORKERS=$(ls ${WORKERS_DIR})

docker login

build_worker() {
    echo -e "Building worker '${YELLOW}${1}${R}'"
    docker build -t ${1}:latest "${WORKERS_DIR}/${1}/" -f "${WORKERS_DIR}/${1}/${DOCKER_DOCKERFILE_NAME}"
    echo -e "Built worker '${GREEN}${1}${R}'\n\n"
}

push_worker() {
    echo -e "Pushing worker '${YELLOW}${1}${R}'"
    docker push ${DOCKER_ID_USER}/${1}:latest
    echo -e "Pushed worker '${GREEN}${1}${R}'\n\n"
}

# Build each worker
for worker in ${WORKERS}; do
    # Check that there is a Dockerfile beforehand
    if [ -f "${WORKERS_DIR}/${worker}/${DOCKER_DOCKERFILE_NAME}" ]; then
        # Build only if this is the worker specified or if no worker was specified
        if [ "${1}" == "${worker}" ] || [ ${#@} -eq 0 ]; then
            build_worker ${worker}
            push_worker ${worker}
        fi
    fi
done
