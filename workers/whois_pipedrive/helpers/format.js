var formatPerson = (person) => {
    var string = '*Name* : ' + person.name + "\r\n";
    if (person.org_name) {
        string += '*Organisation* : ' + person.org_name + "\r\n";
    }

    for (var i in person.phone) {
        var phoneItem = person.phone[i];
        if (phoneItem.value) {
            var additionalLabel = phoneItem.label ? '(' + phoneItem.label + ')' : '';
            string += '*Phone ' + additionalLabel + '* : ' + phoneItem.value + "\r\n";
        }
    }
    for (i in person.email) {
        var emailItem = person.email[i];
        if (emailItem.value) {
            additionalLabel = emailItem.label ? '(' + emailItem.label + ')' : '';
            string += '*Email ' + additionalLabel + '* : ' + emailItem.value + "\r\n";
        }
    }
    return string;
};

module.exports.formatPerson = formatPerson;
