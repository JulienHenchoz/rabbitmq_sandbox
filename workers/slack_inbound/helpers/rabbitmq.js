var amqp = require('amqplib/callback_api');
const RECONNECT_TIMEOUT = 5000;
var connection = null;

var isConnecting = false;
/**
 * Initialize the connection to rabbitmq.
 * If connection failed, try again every 5 seconds.
 */
var init = async () => {
    return await new Promise((resolve, reject) => {
        if (!isConnecting) {
            amqp.connect(process.env.RABBITMQ_URL, (err, conn) => {
                isConnecting = true;
                console.log("[AMQP] Trying to connect to RabbitMQ on " + process.env.RABBITMQ_URL + " ...");
                if (err) {
                    console.error("[AMQP]", err.message);
                    connection = null;
                    isConnecting = false;
                    return setTimeout(init, RECONNECT_TIMEOUT);
                }
                conn.on('ready', function () {
                    isConnecting = false;
                });

                conn.on("error", function (err) {
                    isConnecting = false;
                    if (err.message !== "Connection closing") {
                        connection = null;
                        console.error("[AMQP] conn error", err.message);
                    }
                });
                conn.on("close", function () {
                    isConnecting = false;
                    console.error("[AMQP] reconnecting");
                    connection = null;
                    return setTimeout(init, RECONNECT_TIMEOUT);
                });
                connection = conn;
                resolve(conn);
            });
        }
    });
};

/**
 * Publish an event to the given queue
 * @param exchange
 * @param queue
 * @param payload
 */
var publish = async (exchange, queue, payload) => {
    console.log("[AMQP] Publishing...");
    if (connection === null) {
        await init();
    }
    connection.createChannel(function(err, ch) {
        if (err) {
            console.error(err);
            return;
        }
        ch.assertExchange(exchange, 'fanout', {durable: false});

        ch.publish(exchange, queue, new Buffer(JSON.stringify(payload)));
        console.log("[AMQP] Sent event to exchange " + exchange + ", queue '" + queue + "'!");
    });
};

/**
 * Start listening for the given queue
 * @param exchange
 * @param queue
 * @param callback
 */
var consume = async (exchange, queue, callback) => {
    if (connection === null) {
        await init();
    }
    connection.createChannel(function(err, ch) {
        if (err) {
            console.error(err);
            return;
        }
        ch.assertExchange(exchange, 'fanout', {durable: false});
        ch.assertQueue(queue, {durable: false});
        ch.bindQueue(queue, exchange, '');

        console.log("[AMQP] Listening to events on exchange " + exchange +  ", queue " + queue + "'...", queue);

        ch.consume(queue, function (msg) {
            callback(msg);
        }, {noAck: true});
    });
};

module.exports.init = init;
module.exports.publish = publish;
module.exports.consume = consume;
