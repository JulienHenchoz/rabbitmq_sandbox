var format = require('../helpers/format');
const request = require('request');
var parseString = require('xml2js').parseString;

const searchUrl = 'https://tel.search.ch/api/?key=' + process.env.SEARCH_CH_TOKEN + '&was=';

var find = async (term) => {
    return await new Promise((resolve, reject) => {
        request(searchUrl + encodeURIComponent(term), (error, response, body) => {
            if (body) {
                parseString(body, (err, result) => {
                    try {
                        resolve(format.formatResult(result.feed.entry[0]));
                    }
                    catch (err) {
                        console.error(err);
                        resolve(false);
                    }
                });
            }
        });
    });
};

module.exports.find = find;
