#!/bin/bash

set -e

docker build -t nodejs-in .

docker-compose up
