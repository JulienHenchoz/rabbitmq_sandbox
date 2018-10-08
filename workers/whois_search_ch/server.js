const config = require('./config/config');
const search = require('./helpers/search');
const rabbitmq = require('./helpers/rabbitmq');
const schema = require('./config/schema');

console.info("Starting " + config.workerName + " service!");

const separator = '---';
var getOutput = async (text) => {
    var output = [separator];
    var notFoundString = ':telephone_receiver: :man-shrugging: tel.search.ch service could not find any matches, sorry!';
    return new Promise(async (resolve, reject) => {
        var result = await search.find(text);
        if (result) {
            output.push(":telephone_receiver:  tel.search.ch service found this :");
            output.push(result);
        }
        else {
            output.push(notFoundString);
        }
        output.push(separator);
        resolve(output.join("\r\n"));
    });
};

rabbitmq.consume('whois', 'topic', 'phone', (msg) => {
    try {
        msg = JSON.parse(msg.content.toString());
        if (schema.validate('whois', msg)) {
            getOutput(msg.text).then((output) => {
                // Publish the output message to the outbound exchange, with topic "slack"
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
