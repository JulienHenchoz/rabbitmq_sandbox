var RabbitSchema = require('rabbitmq-schema')

var schema = new RabbitSchema(
    {
        queue: 'slack_outbound',
        messageSchema: {
            type: 'object',
            properties: {
                channel: {type: 'string'},
                source: {type: 'string'},
                message: {type: 'string'}
            },
            required: ['channel', 'source', 'message']
        }
    }
);

var validate = (queueName, msg) => {
    return schema.validateMessage(queueName, msg);
};

module.exports.validate = validate;
