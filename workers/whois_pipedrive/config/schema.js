var RabbitSchema = require('rabbitmq-schema')

var schema = new RabbitSchema(
    {
        queue: 'whois',
        messageSchema: {
            type: 'object',
            properties: {
                response_url: {type: 'string'},
                source: {type: 'string'},
                text: {type: 'string'}
            },
            required: ['text', 'response_url', 'source']
        }
    }
);

var validate = (queueName, msg) => {
    return schema.validateMessage(queueName, msg);
};

module.exports.validate = validate;
