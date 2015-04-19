var parseRequest = function(client, request) {
  client.sendMessage({
    to: request.From,
    body: "You said \"" + request.Body + "\"",
    from: process.env.TWILIO_NUMBER
  }, function(err, messageData) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent! SID: " + messageData.sid);
    }
  });

  return "Message from " + request.From + ": " + request.Body;
}

var getSongInfo = function() {
    // don't forget to to npm install echojs
    // and export your variable!
    var echojs = require('echojs');

    var echo = echojs({
      key: process.env.ECHONEST_KEY
    });

    // http://developer.echonest.com/docs/v4/song.html#search
    echo('song/search').get({
      artist: 'radiohead',
      title: 'karma police'
    }, function (err, json) {
      console.log(json.response);
    });
}

module.exports = parseRequest
