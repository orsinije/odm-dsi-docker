'use strict';

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
var Promise = require('promise');

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
        console.log("Sending event to DSI: " + evt);
    return new Promise(function(resolve) {
        request.post({
                url: DSI_IN_URL,
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/xml'
                },
                body: evt
            },
            function (err, response, body) {
                if (err) {
                    console.log(err);
                    console.log(response);
                    if(body){
                        console.log(body.url);
                        console.log(body.explanation);
                    }
                    resolve(false);
                } else {
                    console.log("Reponse: " + response.statusCode);
                    resolve(true);
                }
            });
    });
}

const app = express();
app.use(express.static('pub'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
}));

var  http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

app.post("/create-person",
         function (req, res) {
                 sendEvent(createEventNew(req.body.name)).then(function (status) {
                         var msg = (status) ? 'Created person: ' + name : 'Failed to create person :' + name;
                         console.log(msg);
                         socket.emit('message', msg);
                 });
                 res.status(200).end();
         });

app.post("/say-hello",
         function (req, res) {
                sendEvent(createEventHello(req.body.name)).then(function (status) {
                        var msg = (status) ? 'Say hello to: ' + name : ' Failed to say hello to: ' + name;
                        console.log(msg);
                        socket.emit('message', msg);
                });
                res.status(200).end();
        });

app.post("/out", function (req, res) {
    io.sockets.emit('event', JSON.stringify(req.body));
    res.status(200).end();
});

server.listen(PORT, HOST, function () {
    console.log('Running on http://%s:%s', HOST, PORT);
});
