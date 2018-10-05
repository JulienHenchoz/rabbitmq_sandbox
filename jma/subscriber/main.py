import sys
import pika as amqp

QUEUE = 'hello-world'
EXCHANGE = 'default-exchange'

""" Create connection """
conn = amqp.BlockingConnection(
    amqp.ConnectionParameters(
        host='localhost',
        virtual_host='ideative',
        credentials=amqp.credentials.PlainCredentials(
            username='ideative',
            password='fhscz2TVG4b6CDaqP7AjGtoUq4',
        )
    )
)

""" Connect channel """
channel = conn.channel()

""" Create exchange """
channel.exchange_declare(
    exchange=EXCHANGE,
    exchange_type='fanout',
)

""" Create queue """
channel.queue_declare(
    queue=QUEUE,
)

""" Bind queue """
channel.queue_bind(
    exchange=EXCHANGE,
    queue=QUEUE
)

print(' [*] Waiting for messages. To exit press CTRL+C')


def callback(ch, method, properties, body):
    print(" [x] %r" % body)


channel.basic_consume(
    callback,
    queue=QUEUE,
    no_ack=True
)

try:
    channel.start_consuming()
except KeyboardInterrupt:
    channel.close()
    conn.close()
    sys.exit(1)
