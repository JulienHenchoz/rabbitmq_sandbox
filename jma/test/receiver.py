#!/usr/bin/env python
import pika

connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host='localhost',
        virtual_host='ideative',
        credentials=pika.credentials.PlainCredentials(
            username='ideative',
            password='fhscz2TVG4b6CDaqP7AjGtoUq4',
        )
    ))
channel = connection.channel()

channel.exchange_declare(exchange='logs',
                         exchange_type='fanout')

result = channel.queue_declare(exclusive=True, queue='test')

channel.queue_bind(exchange='logs',
                   queue='test')

print(' [*] Waiting for logs. To exit press CTRL+C')


def callback(ch, method, properties, body):
    print(" [x] %r" % body)


channel.basic_consume(callback,
                      queue='test',
                      no_ack=True)

channel.start_consuming()
