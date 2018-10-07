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
        var message = {
            channel: req.body.user_id,
            text: req.body.text,
        };
        // Publish the whois event to the exchange "whois", to all queues
        rabbitmq.publish(commandName, '', message);
        console.log("Received payload, pushed to exchange '" + commandName + "' : ", req.body);
        res.send(':robot_face: Let me ask my robot friends about this... :robot_face:');
    }
    else {
        res.send('Empty body');
    }
});

module.exports = router;
