const config = require('../config/config');
const { WebClient } = require('@slack/client');
const web = new WebClient(config.slackToken);

/**
 * Posts a message to the given Slack channel
 * @param channel
 * @param message
 */
var post = (channel, message) => {
    web.chat.postMessage({
        channel: channel,
        text: message
    }).then((res) => {
        console.log('Notification sent: ', channel, message);
    }).catch(console.error);
}

module.exports.post = post;
