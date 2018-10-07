var RabbitSchema = require('rabbitmq-schema');

var schema = new RabbitSchema(
    {
        queue: 'whois',
        messageSchema: {
            type: 'object',
            properties: {
                channel: {type: 'string'},
                text: {type: 'string'}
            },
            required: ['text', 'channel']
        }
    }
);

var validate = (queueName, msg) => {
    return schema.validateMessage(queueName, msg);
};

module.exports.validate = validate;
