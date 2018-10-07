# Slack Outbound service

This service listens to the "slack_outbound" exchange of RabbitMQ, and posts stuff to slack according to the message content.

The schema of messages can be found in ./config/schema.js

Needs the following environment variables to run :
- `RABBITMQ_URL=amqp://xxxxx`
- `SLACK_TOKEN=xxxxx`
