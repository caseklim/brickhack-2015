var accountSid = 'AC4c35deeaa82f3fa0450ca2960607d802';
var authToken = "c93b4e67ec06e3eda5dbbcb16cfb5fbf";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var parseRequest = require('./request-parser');

app.use(bodyParser.urlencoded({ extended : false }));

app.get("/", function(req, res) {
  res.send("Hello, world");
})

app.post("/sms/", function(req, res) {
  var client = new twilio.RestClient(accountSid, authToken);

  console.log(parseRequest(client, req.body));
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
