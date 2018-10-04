var amqp = require('amqplib/callback_api');
console.info("Starting annoying pusher!");

var connect = () => {
    amqp.connect('amqp://rabbitmq', function (err, conn) {
        console.log("Trying to connect to RabbitMQ...");
        if (err) {
            console.error(err);
            setTimeout(connect, 1000);
            return;
        }
        conn.createChannel(function (err, ch) {
            setInterval(() => {
                var q = 'hello';

                ch.assertQueue(q, {durable: false});
                // Note: on Node 6 Buffer.from(msg) should be used
                ch.sendToQueue(q, new Buffer('Hello World!'));
                console.log(" [x] Sent 'Hello World!'");
            }, 2000);

        });
    });
};

connect();
