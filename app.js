/**
 * Module dependencies
 */

var express         = require('express'),
    // routes          = require('./routes'),
    // api             = require('./routes/api'),
    http            = require('http'),
    path            = require('path'),
    twilio          = require('twilio'),
    bodyParser      = require('body-parser'),
    parseRequest    = require('./request-parser');

var app = module.exports = express();


/**
 * Configuration
 */
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// All environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Routes
 */

// Serve index and view partials
// app.get('/', routes.index);
// app.get('/partials/:name', routes.partials);

// Configure queries to the database
// app.post('/users', api.create);
// app.post('/verify', api.verify);
// app.get('/user/:phone', api.getUser)

app.post("/sms", function(req, res) {
  var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN);

  parseRequest(client, req.body);
});

// Redirect all others to the index (HTML5 history)
// app.get('*', routes.index);


/**
 * Start Server
 */

var server = app.listen(app.get('port'), function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Piper listening at http://%s:%s', host, port);

});
