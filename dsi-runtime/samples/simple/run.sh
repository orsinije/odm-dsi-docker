#!/bin/bash

SRC_DIR=`dirname $0`
SAMPLES_DIR=$SRC_DIR/..

echo "Starts single DSI Runtime"
pushd $SAMPLES_DIR
./dsi-single-run.sh
popd

echo "Waiting 60s to ensure that DSI runtime is ready"
sleep 60

DSI_IP=`docker exec samples_dsi-runtime_1 hostname -I`
echo "IP of the DSI server: $DSI_IP"

echo "Deploys solution"
$SRC_DIR/solution_deploy.sh $DSI_IP 9443

echo "Waiting 30s to ensure that the solution and the connectivity configuration is deployed"
sleep 30

echo "Create a person"
$SRC_DIR/create_person.sh $DSI_IP john.doe
