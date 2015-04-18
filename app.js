var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var Parser = require('./request-parser');

app.use(bodyParser.urlencoded({ extended : false }));

app.get("/", function(req, res) {
  res.send("Hello, world");
})

app.post("/sms/", function(req, res) {
  console.log(Parser.test(req.body));
  res.send("received");
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
