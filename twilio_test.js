// Your accountSid and authToken from twilio.com/user/account
var accountSid = 'AC4c35deeaa82f3fa0450ca2960607d802';
var authToken = "c93b4e67ec06e3eda5dbbcb16cfb5fbf";
var client = require('twilio')(accountSid, authToken);

client.messages.create({
    body: "Test",
    to: "+13016414902",
    from: "+12407527884"
}, function(err, message) {
    console.log(err ? err.message : message.sid);
});
