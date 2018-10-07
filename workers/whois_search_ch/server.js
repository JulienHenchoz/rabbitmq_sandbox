const config = require('./config/config');
const search = require('./helpers/search');
const rabbitmq = require('./helpers/rabbitmq');
const schema = require('./config/schema');

console.info("Starting " + config.workerName + " service!");

var getOutput = async (text) => {
    var notFoundString = ':man-shrugging: Search.ch service could not find any matches, sorry! :woman-shrugging: ';
    return new Promise(async (resolve, reject) => {
        var result = await search.find(text);
        if (result) {
            var intro = ":male-detective: tel.search.ch service found this : :female-detective:  \r\n-\r\n";
            resolve(intro + '*Name* : ' + result);
        }
        else {
            resolve(notFoundString);
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
