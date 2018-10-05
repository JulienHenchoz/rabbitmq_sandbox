import json
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

message = {
    'hello': 'world'
}

""" Publish message """
channel.basic_publish(
    exchange=EXCHANGE,
    routing_key=QUEUE,
    body=json.dumps(message)
)


print(" [x] Sent %r" % json.dumps(message))
conn.close()
