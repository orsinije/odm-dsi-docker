#!/bin/bash

set -e

docker build -t nodejs-bridge .

docker-compose up
