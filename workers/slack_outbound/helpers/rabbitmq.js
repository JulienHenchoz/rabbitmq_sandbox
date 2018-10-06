var amqp = require('amqplib/callback_api');

var channel = null;

/**
 * Initialize the connection to rabbitmq.
 * If connection failed, try again every 5 seconds.
 */
var init = async () => {
    var result = await new Promise((resolve, reject) => {
        if (channel !== null) {
            resolve(channel);
        }
        else {
            amqp.connect(process.env.RABBITMQ_URL, (err, conn) => {
                console.log("Trying to connect to RabbitMQ on " + process.env.RABBITMQ_URL + " ...");
                if (err) {
                    throw err;
                }
                conn.createChannel((err, ch) => {
                    if (err) {
                        throw err;
                    }
                    channel = ch;
                    console.log("Connected!")
                    resolve(channel);
                });
            });
        }
    });
    return result;
};

/**
 * Publish an event to the given queue
 * @param queue
 * @param payload
 */
var publish = async (queue, payload) => {
    console.log("Publishing...");
    if (!channel) {
        //throw 'Trying to publish while not connected to RabbitMQ! 1538776047'
        channel = await init();
    }
    channel.assertQueue(queue, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    channel.sendToQueue(queue, new Buffer(JSON.stringify(payload)));
    console.log("Sent event to queue '" + queue + "'!");
}

/**
 * Start listening for the given queue
 * @param queue
 * @param callback
 */
var consume = async (queue, callback) => {
    if (!channel) {
        //throw 'Trying to consume while not connected to RabbitMQ! 1538777031';
        channel = await init();
    }
    channel.assertQueue(queue, {durable: false});
    console.log("Listening to events on queue '" + queue + "'...", queue);

    channel.consume(queue, function (msg) {
        callback(msg);
    }, {noAck: true});
}

module.exports.init = init;
module.exports.publish = publish;
module.exports.consume = consume;
