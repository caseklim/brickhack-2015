// Super important constants
var RANDY = "+19143258424";
var BRIAN = "+13016414902";

var dialects = require('./dialects.json');
var format = require('string-format');
format.extend(String.prototype)

var echojs = require('echojs');

var echo = echojs({
  key: process.env.ECHONEST_KEY
});

String.prototype.contains = function(s) {
  return this.toLowerCase().indexOf(s.toLowerCase()) != -1;
}

// This is the entry point for all SMS requests
var parseRequest = function(client, request) {
  var body = request.Body.trim();

  if (body.contains("who sings ") != -1 && request.From == RANDY)
    trollRandy(client, request);
  else if (body.contains("commands"))
    sendCommands(client, request);
  else if (body.contains("who sings ") != -1)
    getArtistBySongName(client, request);
  else
    echoText(client, request);
}

// For teh lolz
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

// A proof-of-concept for connecting all of our APIs
var getArtistBySongName = function(client, request) {
    var songName = request.Body.replace("Who sings ", "").replace("?", "").trim();
    console.log(songName);

    // http://developer.echonest.com/docs/v4/song.html#search
    echo('song/search').get({
      title: songName,
      results: 1,
      sort: "artist_familiarity-desc"
    }, function (err, json) {
      var songs = json.response.songs;

      var artistName = songs ? songs[0].artist_name : "Nobody";


      client.sendMessage({
        to: request.From,
        body: dialects.normal.whoSings.format(artistName, songName),
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

// Echos what the user sent for testing purposes
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

// Sends list of commands with short descriptions to user
var sendCommands = function(client, request) {
  client.sendMessage({
    to: request.From,
    from: process.env.TWILIO_NUMBER,
    body: "Who sings [song name]: tells you who sings a song"
  }, function(err, messageData) {
    if (err) {
      console.log(err);
    } else {
      console.log("Help sent! SID: " + messageData.sid);
    }
  });
}

module.exports = parseRequest
