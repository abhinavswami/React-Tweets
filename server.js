// Require dependencies
var express = require('express'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    mongoose = require('mongoose'),
    twitter = require('ntwitter'),
    routes = require('./routes'),
    config = require('./config'),
    streamHandler = require('./utils/streamHandler');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');

// Connect to our mongo database
mongoose.connection.openUri('mongodb://localhost/react-tweets');

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open at ' + port);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// Create a ntwitter instance
var twit = new twitter(config.twitter);

twit.verifyCredentials(function (err, data) {
    if (err)
        console.log("Unable to verify credentials: " + err);
});

// Index route  
app.get('/', routes.index);

// Page route
app.get('/page/:page/:skip', routes.page);

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public"));

// Fire it up (start our server)
var server = http.createServer(app).listen(port, function () {
    console.log("Express server listening at port : " + port);
});

// Initialize socket.io
var io = require('socket.io').listen(server);

// Set a stream listener for tweets matching tracking keywords
twit.stream('statuses/filter', { track: '#harvey, #orlando'}, function (stream) {
    streamHandler(stream, io);
});

