# Slack Inbound service

This service listens to commands coming from Slack, and pushes events to RabbitMQ queue "slack_inbound".
Those commands can then be processed by listening workers.

