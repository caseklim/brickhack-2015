var RANDY = "+19143258424";
var BRIAN = "+13016414902";

// don't forget to to npm install echojs
// and export your variable!
var echojs = require('echojs');

var echo = echojs({
  key: process.env.ECHONEST_KEY
});

var parseRequest = function(client, request) {
  var body = request.Body;

  if (body.indexOf("Who sings ") != -1 && request.From == RANDY)
    trollRandy(client, request);
  else if (body.indexOf("Who sings ") != -1)
    getSongInfo(client, request);
  else
    echoText(client, request);
}

var trollRandy = function(client, request) {
  client.sendMessage({
    to: request.From,
    from: process.env.TWILIO_NUMBER,
    body: "Why don't you figure it out yourself?",
    mediaUrl: "http://stream1.gifsoup.com/view8/20150417/5198682/ha-got-em-o.gif"
  }, function(err, messageData) {
    if (err) {
      console.log(err);
    }
  });
}

var getSongInfo = function(client, request) {
    var songName = request.Body.replace("Who sings ", "").replace("?", "");
    console.log(songName);

    // http://developer.echonest.com/docs/v4/song.html#search
    echo('song/search').get({
      title: songName,
      results: 1,
      sort: "artist_familiarity-desc"
    }, function (err, json) {
      var songs = json.response.songs;

      client.sendMessage({
        to: request.From,
        body: (songs ? songs[0].artist_name : " No one ") + " sings " + songName + ".",
        from: process.env.TWILIO_NUMBER
      }, function(err, messageData) {
        if (err) {
          console.log(err);
        } else {
          console.log("Song request sent! SID: " + messageData.sid);
        }
      });

      console.log(json.response);
    });
}

var echoText = function(client, request) {
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
}

module.exports = parseRequest
