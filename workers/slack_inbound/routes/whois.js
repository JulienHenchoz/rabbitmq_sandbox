/**
 * This route handles the whois command, through the /whois route.
 * If reads the incoming event from Slack and crafts a simplified message to push to the "whois" queue.
 */
var express = require('express');
var router = express.Router();
var rabbitmq = require('../helpers/rabbitmq');
var commandName = 'whois';

router.post('/', function(req, res) {
    if (req.body !== {}) {
        rabbitmq.init().then(() => {
            var message = {
                source: req.body.user_id,
                response_url: req.body.response_url,
                text: req.body.text,
            };
            rabbitmq.publish(commandName, message);
            console.log("Received payload, pushed to queue '" + commandName + "' : ", req.body);
            res.send('Let me ask my robot friends about this...');
        });
    }
    else {
        res.send('Empty body');
    }
});

module.exports = router;
