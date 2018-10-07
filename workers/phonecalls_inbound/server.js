/**
 * @author Julien Henchoz
 * @date 19.09.2018
 * Listens to events coming from the Yeastar server using AMI events, and pushes them to Slack.
 * @see https://www.npmjs.com/package/asterisk.io
 */

const config = require('./config/config');
const users = require('./models/user');
const rabbitmq = require('./helpers/rabbitmq');
console.log("Start service " + config.workerName + "!");

var aio = require('asterisk.io'),
    ami = null;

var initialize = () => {
    console.log("Initializing connection to AMI service...");
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
    ami.on('ready', function(){
        console.log('Initialized and listening. Let\'s process some calls!');
    });

    /**
     * In case something fucks up, don't be afraid to tell
     */
    ami.on('error', function(err){
        // throw err;
        if(err.name == 'E_AMI_SOCKED_CLOSE' || err.name == 'E_AMI_SOCKED_ERROR'){
            console.log("Reconnecting...");
            // E_AMI_SOCKED_CLOSE: lost connection to server
            // E_AMI_SOCKED_ERROR: could not connect, maybe asterisk is down
            setTimeout(function(){
                initialize();
            }, 500); // try to connect/reconnect in 1 second
        }
        else {
            console.error(err);
        }
    });

    /**
     * For every "DialBegin" event, fetch the user matching the Yeastar number in the users.json file.
     * If one is found, send a Slack notification to the guy.
     * Else, say we couldn't find him, better luck next time.
     */
    ami.on('eventNewchannel', function(data){
        console.log(data);
        var slackId = users.getSlackId(data.Exten);
        if (slackId) {
            // Craft a message compatible with the "whois" schema
            var slackOutboundMessage = {
                channel: slackId,
                source: config.workerName,
                message: getDialBeginText(data)
            };
            rabbitmq.publish('slack_outbound', slackOutboundMessage);

            var whoisMessage = {
                source: slackId,
                text: data.CallerIDNum,
                response_url: ''
            };
            rabbitmq.publish('whois', whoisMessage);
        }
        else {
            console.error('User not found in Slack : ' + data.DestCallerIDNum);
        }
    });
};

users.load().then(() => {
    initialize();
}, (err) => {
    console.error(err);
});


/**
 * Extracts core informations from the raw AMI data
 * @param data
 * @returns {{incomingNumber: *, incomingName: *, destinationNumber: *, destinationName: *}}
 */
var getDialBeginText = (data) => {
    return ':phone:   Incoming call from ' + data.CallerIDNum + ' !';
};
