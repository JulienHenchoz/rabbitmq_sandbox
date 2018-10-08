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
        var output = ["---"];
        if (suggestions.length > 0) {
            output.push(":male-detective:   Pipedrive service found " + suggestions.length + " matche(s)");
            output.push(suggestions.join("\r\n-\r\n"));
        }
        else {
            output.push(':male-detective: :man-shrugging: Pipedrive service could not find any matches, sorry!');
        }
        output.push("---");

        resolve(output.join("\r\n"));
    });

};

rabbitmq.consume('whois', 'topic', 'name', (msg) => {
    try {
        msg = JSON.parse(msg.content.toString());
        if (schema.validate('whois', msg)) {
            getOutput(msg.text).then((output) => {
                // Publish the output message to the slack_outbound exchange, to all queues
                rabbitmq.publish('outbound', 'topic', 'slack', {
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
