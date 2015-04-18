var express = require('express');
var app = express();
var Parser = require('./request-parser');

app.get("/", function(req, res) {
  res.send("Hello, world");
})

app.get("/sms", function(req, res) {
  console.log(req);
  console.log(Parser.test(req));
  res.send("received");
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
