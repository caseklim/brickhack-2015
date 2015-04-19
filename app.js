var express = require('express');
var app = express();
var twilio = require('twilio');
var bodyParser = require('body-parser');
var echonest = require('./echonest');

var parseRequest = require('./request-parser');

app.use(bodyParser.urlencoded({ extended : false }));

app.get("/", function(req, res) {
  res.send("<style>@-webkit-keyframes pulse { 0% {background-color: #45CEEF;} 25% {background-color: #FFF5A5;} 50% {background-color: #FFD4DA;} 75% {background-color: #99D2E4;} 100% {background-color: #D8CAB4;} } body { background-color: #45CEEF; -webkit-animation: pulse 40s infinite alternate; }</style>Hi ;)");
  echonest()
});

app.post("/sms/", function(req, res) {
  var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN);

  parseRequest(client, req.body);
});
app.post("/create/", function(req, res) {
  // TODO: create new user profile
  // 1. save phone number
  // 2. create taste profile
  // 3. update taste profile with genres
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('PiedPiper listening at http://%s:%s', host, port);
});
