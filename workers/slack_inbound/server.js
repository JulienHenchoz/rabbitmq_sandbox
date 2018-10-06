const rabbitmq = require('./helpers/rabbitmq');
const slack = require('./helpers/slack');
const schema = require('./config/schema');
const config = require('./config/config');
const queueName = 'slack_outbound';

console.info("Starting " + config.workerName + " service!");

rabbitmq.connect().then(() => {
    rabbitmq.consume(queueName, (msg) => {
        try {
            msg = JSON.parse(msg.content.toString());
            if (schema.validate(queueName, msg)) {
                slack.post(msg.channel, msg.message);
            }
        }
        catch (err) {
            console.error(err);
        }
    });
});