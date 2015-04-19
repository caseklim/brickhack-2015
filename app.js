var express = require('express');
var app = express();
var twilio = require('twilio');
var bodyParser = require('body-parser');

var parseRequest = require('./request-parser');

app.use(bodyParser.urlencoded({ extended : false }));

app.get("/", function(req, res) {
  res.send("<style>@-webkit-keyframes pulse { 0% {background-color: #45CEEF;} 25% {background-color: #FFF5A5;} 50% {background-color: #FFD4DA;} 75% {background-color: #99D2E4;} 100% {background-color: #D8CAB4;} } body { background-color: #45CEEF; -webkit-animation: pulse 40s infinite alternate; }</style>Hi ;)");
});

app.post("/sms/", function(req, res) {
  var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN);

  parseRequest(client, req.body);
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
