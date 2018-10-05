import json
import time
import pika as amqp
import sys

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

message = {
    'hello': 'world'
}

while True:
    try:
        """ Publish message """
        channel.basic_publish(
            exchange=EXCHANGE,
            routing_key=QUEUE,
            body=json.dumps(message)
        )
        sys.stdout.write(" [x] Sent %r \n" % json.dumps(message))

        time.sleep(TIME_BEFORE_RECONNECT)
    except Exception as ex:
        channel.close()
        conn.close()
        if len(ex.args) > 1:
            sys.stdout.write("Exception : %s\n" % ex.args[1])
        else:
            sys.stdout.write("Exception : %s\n" % ex.args[0])
        sys.exit(1)
