#!/bin/bash

function isonline() {
        SOL_MANAGER_OPTS="--host=$1 --sslProtocol=TLSv1.2 --disableServerCertificateVerification=true --disableSSLHostnameVerification=true --username=tester --password=tester"
        docker-compose run dsi-runtime /dsi-cmd serverManager isonline $SOL_MANAGER_OPTS
}

SRC_DIR=`dirname $0`
SAMPLES_DIR=$SRC_DIR/..

echo "Starts single DSI Runtime"
pushd $SAMPLES_DIR
./dsi-single-run.sh
CONTAINER_ID=`docker-compose ps -q`
echo "DSI container: $CONTAINER_ID"
popd

DSI_IP=`docker exec $CONTAINER_ID hostname -I`
echo "DSI IP: $DSI_IP"

# wait until DSI is ready
until [ "$ISONLINE" == "1" ]
do
        echo "Waiting 5s before checking that DSI runtime is online"
        sleep 5
        ISONLINE=`isonline $DSI_IP >/dev/null && echo 1 || echo 0`
        echo "Is online result: $ISONLINE"
done

echo "Deploys solution"
$SRC_DIR/solution_deploy.sh $DSI_IP 9443

echo "Waiting 30s to ensure that the solution and the connectivity configuration are deployed"
sleep 30

echo "Create a person"
$SRC_DIR/create_person.sh $DSI_IP john.doe
