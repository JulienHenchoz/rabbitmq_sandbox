var amqp = require('amqplib/callback_api');

var connection = null;

/**
 * Initialize the connection to rabbitmq.
 * If connection failed, try again every 5 seconds.
 */
var connect = () => {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBITMQ_URL, (err, conn) => {
            console.log("Trying to connect to RabbitMQ...");
            if (err) {
                throw err;
            }
            connection = conn;
            console.log("Connected!")
            resolve();
        });
    });
};

/**
 * Publish an event to the given queue
 * @param queue
 * @param payload
 */
var publish = (queue, payload) => {
    if (!connection) {
        throw 'Trying to publish while not connected to RabbitMQ! 1538776047'
    }
    connection.createChannel((err, ch) => {
        ch.assertQueue(queue, {durable: false});
        // Note: on Node 6 Buffer.from(msg) should be used
        ch.sendToQueue(queue, new Buffer(JSON.stringify(payload)));
        console.log("Sent event to queue '" + queue + "'!");
    });
}

/**
 * Start listening for the given queue
 * @param queue
 * @param callback
 */
var consume = (queue, callback) => {
    if (!connection) {
        throw 'Trying to consume while not connected to RabbitMQ! 1538777031';
    }
    connection.createChannel((err, ch) => {

        ch.assertQueue(queue, {durable: false});
        console.log("Listening to events on queue '" + queue + "'...", queue);

        ch.consume(queue, function (msg) {
            callback(msg);
        }, {noAck: true});
    });
}

module.exports.connect = connect;
module.exports.publish = publish;
module.exports.consume = consume;
