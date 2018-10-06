var formatPerson = (person) => {
    var string = 'Name : ' + person.name + "\r\n";
    string += 'Organisation : ' + person.org_name + "\r\n";

    for (var i in person.phone) {
        var phoneItem = person.phone[i];
        string += 'Phone (' + phoneItem.label + ') : ' + phoneItem.value + "\r\n";
    }
    for (i in person.email) {
        var emailItem = person.email[i];
        string += 'Email (' + emailItem.label + ') : ' + emailItem.value + "\r\n";
    }
    return string;
};

module.exports.formatPerson = formatPerson;
