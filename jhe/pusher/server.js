var amqp = require('amqplib/callback_api');
console.info("Starting annoying pusher!");

var connect = () => {
amqp.connect('amqp://127.0.0.1', function(err, conn) {
  console.log("Trying to connect to RabbitMQ...");
  if (err) {
    setTimeout(connect, 1000);
    return;
  }
  conn.createChannel(function(err, ch) {
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
