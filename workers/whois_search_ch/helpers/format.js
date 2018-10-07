var formatResult = (result) => {
    console.log(result);
    var string = '*Name* : ' + result.title[0]["_"] + "\r\n";
    string += '*Phone* : ' + result['tel:phone'][0] + "\r\n";

    return string;
};

module.exports.formatResult = formatResult;
