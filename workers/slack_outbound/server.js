const rabbitmq = require('./helpers/rabbitmq');
const slack = require('./helpers/slack');
const schema = require('./config/schema');
const config = require('./config/config');

console.info("Starting " + config.workerName + " service!");

rabbitmq.consume('outbound', 'topic', 'slack', (msg) => {
    try {
        msg = JSON.parse(msg.content.toString());
        if (schema.validate('outbound', msg)) {
            slack.post(msg.channel, msg.message);
        }
    }
    catch (err) {
        console.error(err);
    }
});
