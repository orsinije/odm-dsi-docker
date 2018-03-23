#!/bin/bash

set -e

docker build -t nodejs-in .

docker run -ti -p8080:8080 nodejs-in
