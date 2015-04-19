var express = require('express');
var app = express();
var twilio = require('twilio');
var bodyParser = require('body-parser');

var parseRequest = require('./request-parser');

app.use(bodyParser.urlencoded({ extended : false }));

app.get("/", function(req, res) {
  res.send("Hello, world");
})

app.post("/sms/", function(req, res) {
  var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN);

  console.log(parseRequest(client, req.body));
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
