const config = require('./config/config');
const pipedrive = require('./helpers/pipedrive');
const format = require('./helpers/format');
const rabbitmq = require('./helpers/rabbitmq');
const schema = require('./config/schema');

console.info("Starting " + config.workerName + " service!");

var getOutput = async (text) => {
    return new Promise(async (resolve, reject) => {
        var apiResults = await pipedrive.findPersons(text);
        var suggestions = [];

        for (var i in apiResults) {
            var person = apiResults[i];
            suggestions.push(format.formatPerson(person));
        }
        if (suggestions.length > 0) {
            var intro = ":male-detective: Pipedrive service found " + suggestions.length + " matche(s) :female-detective:  \r\n-\r\n";
            resolve(intro + suggestions.join("\r\n-\r\n"));
        }
        else {
            resolve(':man-shrugging: Pipedrive service could not find any matches, sorry! :woman-shrugging: ');
        }
    });

};

rabbitmq.consume('whois', config.workerName, (msg) => {
    try {
        msg = JSON.parse(msg.content.toString());
        if (schema.validate('whois', msg)) {
            getOutput(msg.text).then((output) => {
                // Publish the output message to the slack_outbound exchange, to all queues
                rabbitmq.publish('slack_outbound', '', {
                    channel: msg.channel,
                    message: output,
                    source: config.workerName
                });
            });
        }
    }
    catch (err) {
        console.error(err);
    }
});
