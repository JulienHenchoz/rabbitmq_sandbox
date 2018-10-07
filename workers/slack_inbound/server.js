const config = require('./config/config');
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
var whois = require('./routes/whois');

console.info("Starting " + config.workerName + " service!");
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/whois', whois);

app.listen(8080, function () {
    console.log(config.workerName + ' is now listening on port 8080!')
});



