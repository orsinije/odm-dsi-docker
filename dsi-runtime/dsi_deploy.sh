#!/bin/bash

# This script deploys a DSI solution to a DSI runtime server.
#
# DSI_HOSTNAME: hostname of the DSI server.
# DSI_PORT: port of the DSI server.
# ESA: the path to the .ESA file containing the DSI solution.

set -e

function print_usage {
        echo "USAGE: $0 <DSI_HOSTNAME> <DSI_PORT> <ESA>"
}

if [ -z "$3" ]; then
        print_usage
        exit 1
else
        DSI_HOSTNAME="$1"
        DSI_PORT="$2"
        ESA="$3"
fi

SRC_DIR=`dirname $0`

DSI_HOME_BIN="/opt/dsi/runtime/ia/bin"

export JAVA_HOME=/opt/dsi/jdk/jre

echo "JAVA_HOME=$JAVA_HOME" > /opt/dsi/runtime/wlp/etc/server.env

$DSI_HOME_BIN/solutionManager deploy remote $ESA $SOL_MANAGER_OPTS --host=$DSI_HOSTNAME --port=$DSI_PORT
