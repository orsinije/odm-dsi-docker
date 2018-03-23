#!/bin/bash

function print_usage {
        echo "USAGE: $0 <DSI_IP> <DSI_PORT>"
}

if [ -z $2 ]; then
        print_usage
        exit 1
else
        DSI_IP="$1"
        DSI_PORT="$2"
fi

SRC_DIR=`dirname $0`
SRC_DIR=`realpath $SRC_DIR`

SOL_MANAGER_OPTS="--sslProtocol=TLSv1.2 --disableServerCertificateVerification=true --disableSSLHostnameVerification=true --username=tester --password=tester"

echo "Deploying solution to $DSI_IP"

SOL_DIR=`realpath $SRC_DIR/../simple`
echo "Directory containing the solution: $SOL_DIR"

cd $SRC_DIR

docker-compose run -v $SOL_DIR:/dropins dsi-runtime /dsi-cmd solutionManager deploy remote /dropins/simple_solution-0.0.esa --host=$DSI_IP --port=$DSI_PORT $SOL_MANAGER_OPTS

docker-compose run -v $SOL_DIR:/dropins dsi-runtime /dsi-cmd connectivityManager deploy remote /dropins/simple_solution-0.0.esa /dropins/in-connectivity-server-configuration.xml --host=$DSI_IP --port=$DSI_PORT $SOL_MANAGER_OPTS