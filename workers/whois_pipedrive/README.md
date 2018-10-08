# Whois Pipedrive

This service listens to the "whois" exchange of RabbitMQ, with topic "name", searches for the term in Pipedrive's persons and posts results to Slack.

The schema of messages can be found in ./config/schema.js

Needs the following environment variables to run :
- `RABBITMQ_URL=amqp://xxxxx`
- `PIPEDRIVE_TOKEN=xxxxx`
