# Slack Outbound service
*By Julien Henchoz*

This service listens to the "slack_outbound" queue of RabbitMQ, and posts stuff to slack according to the message content.

The schema of messages can be found in ./schema.js
