const config = require('../config/config');
const fs = require('fs');
const path = require('path');

var usersMapping = [];
var load = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(config.usersDatabase), (err, data) => {
            if (err) {
                reject('Could not open file ' + config.usersDatabase + '!');
            }

            usersMapping = JSON.parse(data);
            resolve(usersMapping);
        });
    });
};

var getSlackId = (phoneCode) => {
    if (typeof(usersMapping[phoneCode]) !== 'undefined' && usersMapping[phoneCode]) {
        return usersMapping[phoneCode];
    }
    else {
        return null;
    }
};

module.exports.load = load;
module.exports.getSlackId = getSlackId;
