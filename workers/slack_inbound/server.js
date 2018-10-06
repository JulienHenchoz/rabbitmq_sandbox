const rabbitmq = require('./helpers/rabbitmq');
const config = require('./config/config');
const queueName = 'slack_inbound';
var express = require('express');
var app = express();

console.info("Starting " + config.workerName + " service!");

app.use(express.json());

rabbitmq.connect().then(() => {
    // POST method route
    app.post('/whois', function (req, res) {
        rabbitmq.publish('slack_inbound', req.body);
        res.send('Thanks');
    });

    app.listen(8080, function () {
        console.log('Example app listening on port 8080!')
    })
});



