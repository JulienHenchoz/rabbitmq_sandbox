const rabbitmq = require('./helpers/rabbitmq');
const slack = require('./helpers/slack');
const schema = require('./config/schema');
const config = require('./config/config');
const exchangeName = 'slack_outbound';

console.info("Starting " + config.workerName + " service!");

rabbitmq.consume(exchangeName, config.workerName, (msg) => {
    try {
        msg = JSON.parse(msg.content.toString());
        if (schema.validate(exchangeName, msg)) {
            slack.post(msg.channel, msg.message);
        }
    }
    catch (err) {
        console.error(err);
    }
});
