var amqp = require('amqplib/callback_api');
console.info("Starting receiver!");

var connect = () => {
amqp.connect('amqp://127.0.0.1', function(err, conn) {
  console.log("Trying to connect to RabbitMQ...");
  if (err) {
    setTimeout(connect, 1000); 
    return;
  }
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});

  });
});

};

connect();
