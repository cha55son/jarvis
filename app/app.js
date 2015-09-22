var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var validate = require('jsonschema').validate;
var witSchema = require('./wit-schema.json');
var express = require('express');
var app = express();
var bot = require('./bot');

var scriptsPath = path.normalize(__dirname + '/../scripts');
fs.readdirSync(scriptsPath).forEach(function(filename) {
    console.log('Loading %s/%s', scriptsPath, filename);
    require(scriptsPath + '/' + filename)(bot);
});

app
.use(bodyParser.json())
.get('/', function(req, res) {
    res.send('Jarvis 👨  is ready!');
})
.post('/data', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var validObj = validate(req.body, witSchema);
    if (validObj.errors.length > 0) {
        console.error("Failed JSON validation");
        console.error(require('util').inspect(req.body, true, 20));
        return res.send(JSON.stringify({ error: "Failed JSON validation" }));
    }
    var outcomes = req.body;
    console.log("Received %s outcome(s)", outcomes.length);
    for (var i = 0; i < outcomes.length; i++) {
        var outcome = outcomes[i];
        console.log("Outcome %s: found intent '%s'", i, outcome.intent);
    }

    res.send(JSON.stringify({ success: true }));
    // console.log("Intent triggered: %s", req.body.intent);
    return;
    if (scripts[req.body.intent]) {
        console.log("Triggering script for %s", req.body.intent);
        var dataOrPromise;
        try {
            dataOrPromise = scripts[req.body.intent](req.body);
        } catch (err) {
            bot.logger.error(err);
        }
        if (!dataOrPromise) {
           res.send(200); 
        } else if (typeof dataOrPromise.then === 'function') {
            dataOrPromise.then(function(resp) {
                res.send(resp);
            });
        } else {
            res.send(dataOrPromise);
        }
    } else {
        res.send(200);
    }
});
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Jarvis 👨  listening at http://%s:%s', host, port);
});
