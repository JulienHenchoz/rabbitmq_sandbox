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
            print("Exception : %s" % ex.args[1])
        else:
            print("Exception : %s" % ex.args[0])

        print("Try again in %d sec" % TIME_BEFORE_RECONNECT)
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

print(" [*] Waiting for messages. To exit press CTRL+C")


def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)


try:
    channel.basic_consume(
        callback,
        queue=QUEUE,
        no_ack=True
    )

    channel.start_consuming()
except KeyboardInterrupt:
    channel.close()
    conn.close()
    sys.exit(1)
