/**
 * Module dependencies
 */

var express 	= require('express'),
  routes 		= require('./routes'),
  api 			= require('./routes/api'),
  http 			= require('http'),
  path 			= require('path');

var app = module.exports = express();


/**
 * Configuration
 */

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
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// Configure queries to the database
app.post('/users', api.create);
app.post('/verify', api.verify);

// Redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

var server = app.listen(app.get('port'), function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
