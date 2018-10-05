import time
import sys
import pika as amqp

TIME_BEFORE_RECONNECT = 5
QUEUE = 'hello-world'
EXCHANGE = 'default-exchange'

""" Create connection """
conn = None

while True:
    try:
        conn = amqp.BlockingConnection(
            amqp.ConnectionParameters(
                host='rabbitmq',
                virtual_host='ideative',
                credentials=amqp.credentials.PlainCredentials(
                    username='ideative',
                    password='fhscz2TVG4b6CDaqP7AjGtoUq4',
                )
            )
        )

        if conn.is_open:
            break
    except Exception as ex:
        if len(ex.args) > 1:
            sys.stdout.write("Exception : %s\n" % ex.args[1])
        else:
            sys.stdout.write("Exception : %s\n" % ex.args[0])

        sys.stdout.write("Try again in %d sec\n" % TIME_BEFORE_RECONNECT)
        time.sleep(TIME_BEFORE_RECONNECT)

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

sys.stdout.write(' [*] Waiting for messages. To exit press CTRL+C\n')


def callback(ch, method, properties, body):
    sys.stdout.write(" [x] %r\n" % body)


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
