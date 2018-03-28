'use strict';

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const DSI_HOST = "dsi-runtime";
const DSI_IN_URL = "https://" + DSI_HOST + ":9443/in/simple";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function createEventNew(name) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
               + "<m:CreatePerson xmlns:m=\"http://www.ibm.com/ia/xmlns/default/SimpleSolution/model\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.ibm.com/ia/xmlns/default/SimpleSolution/model ../xsd/namespace1/model.xsd \">"
               + "<m:name>" + name + "</m:name>"
               + "<m:description>"
               + "</m:description>"
               + "</m:CreatePerson>";
}

function createEventHello(name) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
               + "<m:SayHello xmlns:m=\"http://www.ibm.com/ia/xmlns/default/SimpleSolution/model\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.ibm.com/ia/xmlns/default/SimpleSolution/model ../xsd/namespace1/model.xsd \">"
               + "<m:person>" + name + "</m:person>"
               + "<m:description>"
               + "</m:description>"
               + "</m:SayHello>";
}

function sendEvent(evt) {
        console.log("Sending event to DSI");

        request.post({
                        url: DSI_IN_URL,
                        method: 'POST',
                        headers: {
                                'Content-Type' : 'application/xml'
                        },
                        body: evt
                      },
                      function (err, response, body) {
                              console.log("Reponse: " + response.statusCode);
                              if (err) {
                                      console.log(err);
                                      console.log(response);
                                      console.log(body.url);
                                      console.log(body.explanation);
                              }
                      });
}

const app = express();

app.use(express.static('pub'));
app.use(express.json());
app.use(express.urlencoded());

app.post('/create-person', (req, res) => {
        sendEvent(createEventNew(req.body.name));
        res.send("Created person: " + req.body.name);
});

app.post('/say-hello', (req, res) => {
        sendEvent(createEventHello(req.body.name));
        res.send("Say hello to: " + req.body.name);
});

app.post("/out", (req, res) => {
        console.log("receive event: " + JSON.stringify(req.body));
        res.end("yes");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
