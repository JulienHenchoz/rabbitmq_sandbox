var Pipedrive = require('pipedrive');
var config = require('../config/config');
var pipedrive = new Pipedrive.Client(process.env.PIPEDRIVE_TOKEN, { strictMode: true });

var findPersons = async (term) => {
    return await new Promise((resolve, reject) => {
        pipedrive.Persons.find ({term: term, limit: config.maxResults}, (err, persons) => {
            if (err) {
                reject(err);
            }
            resolve(persons);
        });
    });
};

module.exports.findPersons = findPersons;
