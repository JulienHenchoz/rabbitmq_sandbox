var amqp = require('amqplib/callback_api');
console.info("Starting receiver!");

var connect = () => {
    amqp.connect('amqp://rabbitmq', function (err, conn) {
        console.log("Trying to connect to RabbitMQ...");
        if (err) {
            console.error(err);
            setTimeout(connect, 1000);
            return;
        }
        conn.createChannel(function (err, ch) {
            var q = 'hello';

            ch.assertQueue(q, {durable: false});
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            ch.consume(q, function (msg) {
                console.log(" [x] Received %s", msg.content.toString());
            }, {noAck: true});

        });
    });
};

connect();
