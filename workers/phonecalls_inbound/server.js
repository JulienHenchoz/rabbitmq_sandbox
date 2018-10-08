/**
 * @author Julien Henchoz
 * @date 19.09.2018
 * Listens to events coming from the Yeastar server using AMI events, and pushes them to Slack.
 * @see https://www.npmjs.com/package/asterisk.io
 */

const config = require('./config/config');
const users = require('./models/user');
const rabbitmq = require('./helpers/rabbitmq');
const RECONNECT_TIMEOUT = 5000;

console.log("Started service " + config.workerName + "!");

var aio = require('asterisk.io'),
    ami = null;

var isConnecting = false;

var initialize = () => {
    if (!isConnecting) {
        isConnecting = true;
        console.log("[AMI] Initializing connection to AMI service...");
        /**
         * Initialize connection to the AMI service on Yeastar server
         */
        ami = aio.ami(
            process.env.YEASTAR_URL,   // Asterisk PBX machine
            process.env.YEASTAR_PORT,
            process.env.AMI_USERNAME,
            process.env.AMI_PASSWORD
        );

        /**
         * Show the world that we're ready to rock
         */
        ami.on('ready', function () {
            isConnecting = false;
            console.log('[AMI] Initialized and listening. Let\'s process some calls!');
        });

        /**
         * In case something fucks up, don't be afraid to tell
         */
        ami.on('error', function (err) {
            isConnecting = false;
            console.error(err);
            console.log("[AMI] Reconnecting...");
            setTimeout(function () {
                initialize();
            }, RECONNECT_TIMEOUT);
        });

        ami.on('close', function(e) {
            console.log('[AMI] Closed!');
        });
        ami.on('disconnect', function(e) {
            console.log('[AMI] disconnected!');
        });
        ami.on('connect', function(e) {
            console.log('[AMI] Connected!');
        });

        /**
         * For every "eventNewchannel" event, fetch the user matching the Yeastar number in the users.json file.
         * If one is found, send a Slack notification to the guy.
         * Else, say we couldn't find him, better luck next time.
         */
        ami.on('eventNewchannel', function (data) {
            console.log(data);
            var slackId = users.getSlackId(data.Exten);
            if (slackId) {
                // Notify the Slack user that a call is coming
                var slackOutboundMessage = {
                    channel: slackId,
                    source: config.workerName,
                    message: getDialBeginText(data)
                };
                rabbitmq.publish('outbound', 'topic', 'slack', slackOutboundMessage);

                // Craft a message compatible with the "whois" schema, so he can receive a hint on who this is
                var whoisMessage = {
                    channel: slackId,
                    text: data.CallerIDNum,
                    response_url: ''
                };
                rabbitmq.publish('whois', 'topic', 'phone', whoisMessage);
            }
            else {
                console.error('User not found in Slack : ' + data.Exten);
            }
        });
    }
};

users.load().then(() => {
    initialize();
}, (err) => {
    console.error(err);
});

/**
 *
 * @param data
 * @returns {string}
 */
var getDialBeginText = (data) => {
    return "---\r\n:phone:   Incoming call from " + data.CallerIDNum + " !\r\n---";
};
