# Communication between NodeJS and DSI

This sample is showing how a NodeJS application can send events to DSI
and receive events from DSI by using the REST API.

## Prerequisites

Build the docker image of DSI, see the [README.md](../../../README.md).

## Run NodeJS and DSI

In order to run both the NodeJS application and DSI with Docker compose:

```
./run.sh
```

Then open the URL: `http://localhost:8080`. It will present a very
simple Web application for sending events to DSI and displaying the events
received from DSI.

## How it works

![Communication DSI NodeJS](./dsi_nodejs.png)

### Send events from NodeJS to DSI

The form in the [index.html](pub/index.html) file sends HTTP POST to the
NodeJS application. In [server.js](./server.js), the method `sendEvent`
sends the event to DSI using the HTTP inbound connectivity feature.

### Receive events in NodeJS from DSI

DSI emits events through the HTTP oubound connectivity to the NodeJS
application (endpoint `/out`). The javascript in [server.js](./server.js)
send it back to the HTML page using WebSocket:

```
app.post("/out", function (req, res) {
    io.sockets.emit('event', JSON.stringify(req.body));
    res.status(200).end();
});
```
