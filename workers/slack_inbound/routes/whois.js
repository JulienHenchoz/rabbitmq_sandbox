/**
 * This route handles the whois command, through the /whois route.
 * If reads the incoming event from Slack and crafts a simplified message to push to the "whois" queue.
 */
var express = require('express');
var router = express.Router();
var rabbitmq = require('../helpers/rabbitmq');
var PhoneNumber = require( 'awesome-phonenumber' );

router.post('/', function(req, res) {
    if (req.body !== {}) {

        let bindingKey = '';
        let answer = '';
        let term;
        if (term = isPhone(req.body.text)) {
            bindingKey = 'phone';
            answer = ':robot_face: Let me ask my robot friends about this phone number "' + term + '"...';
        }
        else {
            term = req.body.text;
            bindingKey = 'name';
            answer = ':robot_face: Let me ask my robot friends about "' + term + '"...';
        }
        let message = {
            channel: req.body.user_id,
            text: term,
        };
        res.send(answer);
        rabbitmq.publish('whois', 'topic', bindingKey, message);
    }
    else {
        res.send('Empty body');
    }
});

var isPhone = (term) => {
    let phoneNumber = new PhoneNumber(term);
    let swissPhoneNumber = new PhoneNumber(term, 'CH');
    let result = null;
    if (phoneNumber.isPossible()) {
        result = phoneNumber.getNumber();
    }
    if (swissPhoneNumber.isPossible()) {
        result = swissPhoneNumber.getNumber();
    }
    return result;
};

module.exports = router;
