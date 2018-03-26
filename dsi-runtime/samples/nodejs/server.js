'use strict';

const express = require('express');
const request = require('request');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const DSI_HOST = "dsi-runtime";

function createEvent(name) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
               + "<m:CreatePerson xmlns:m=\"http://www.ibm.com/ia/xmlns/default/SimpleSolution/model\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.ibm.com/ia/xmlns/default/SimpleSolution/model ../xsd/namespace1/model.xsd \">"
               + "<m:name>" + name + "</m:name>"
               + "<m:description>"
               + "</m:description>"
               + "</m:CreatePerson>";
}

const app = express();

app.get('/in/*', (req, res) => {
        var p = req.path.substring("/in/".length);
        res.send('Name=' + p);

        var url = "https://" + DSI_HOST + ":9443/in/simple";
        console.log("POST to " + url);

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        request.post({
                        url: url,
                        method: 'POST',
                        headers: {
                                'Content-Type' : 'application/xml'
                        },
                        body: createEvent(p)
                },
                function (err, response, body) {
                        if (err) { console.log(err); }
                        console.log(response);
                        console.log(body.url);
                        console.log(body.explanation);
                });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
