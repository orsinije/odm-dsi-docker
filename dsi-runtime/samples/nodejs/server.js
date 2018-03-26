'use strict';

const express = require('express');
const request = require('request');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const DSI_HOST = "dsi-runtime";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function createEvent(name) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
               + "<m:CreatePerson xmlns:m=\"http://www.ibm.com/ia/xmlns/default/SimpleSolution/model\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.ibm.com/ia/xmlns/default/SimpleSolution/model ../xsd/namespace1/model.xsd \">"
               + "<m:name>" + name + "</m:name>"
               + "<m:description>"
               + "</m:description>"
               + "</m:CreatePerson>";
}

function sendEvent(url, name) {
        console.log("POST to " + url);

        request.post({
                        url: url,
                        method: 'POST',
                        headers: {
                                'Content-Type' : 'application/xml'
                        },
                        body: createEvent(name)
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
        var url = "https://" + DSI_HOST + ":9443/in/simple";

        sendEvent(url, req.body.name);
        res.send("Created person: " + req.body.name);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
