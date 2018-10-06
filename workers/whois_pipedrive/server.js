const config = require('./config/config');
const pipedrive = require('./helpers/pipedrive');
const format = require('./helpers/format')
console.info("Starting " + config.workerName + " service!");

// TODO : add listening of queue "whois" and push the result to queue "slack_outbound"
var init = async () => {
    var apiResults = await pipedrive.findPersons('Sudan');
    var suggestions = [];

    for (var i in apiResults) {
        var person = apiResults[i];
        suggestions.push(format.formatPerson(person));
    }

    console.log(suggestions);
};

init();
