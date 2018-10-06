# Slack Inbound service

This service listens to commands coming from Slack, and pushes events to the RabbitMQ queue corresponding to the command name.

For example, `/whois` command will push messages to the "`whois`" queue.
Those commands can then be processed by listening workers.

The pushed messages contain a Slack `response_url` that accepts JSON as payload, and allows to return asynchronous data to Slack to the user.
