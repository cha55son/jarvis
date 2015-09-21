var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
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
    console.log("Intent triggered: %s", req.body.intent);
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
