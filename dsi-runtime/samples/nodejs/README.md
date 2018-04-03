# Communication between NodeJS and DSI

This sample is showing how a NodeJS application can send events to DSI
and receive events from DSI by using the REST API.

## Prerequisites

Build the docker image of DSI, see the [README.md](../../README.md).

## Run NodeJS and DSI

In order to run both the NodeJS application and DSI with Docker compose:

```
./run.sh
```

Then open the URL: `http://localhost:8080`. It will present a very
simple Web application for sending events to DSI and displaying the events
received from DSI.
