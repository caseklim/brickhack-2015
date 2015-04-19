var http = require('http');
var querystring = require('querystring');

var echonest = function() {
    var postData = querystring.stringify({
        "api_key": process.env.ECHONEST_KEY,
        "title": "Call Me Maybe",
        "results": 1,
        "sort": "artist_familiarity-desc"
    });

    var options = {
      hostname: 'http://developer.echonest.com/api/v4',
      port: 80,
      path: '/song/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };

    var req = http.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(postData);
    req.end();
}

module.exports = echonest;
