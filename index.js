/*
 *	Primary file for the API.
 *
 *
 */ 

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require('./config');
const fs = require('fs');

var _data = require('./lib/data');

// @TODO delete 
_data.delete('test', 'newFile', function(err){
	console.log('Error:', err);
});

// Instanciate the http server 
var httpServer = http.createServer(function(req, res){
	
	unifiedServer(req, res);
});

// Start the http, getting the port from config file.
httpServer.listen(config.httpPort, function(){
	console.log("the server is listening in port " + config.httpPort + " in " + config.envName + " enviroment." );
});

// Instanciate the HTTPS server
var httpsServerOptions = {
	'key': fs.readFileSync('./https/privkey.pem'),
	'cert': fs.readFileSync('./https/cacert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, function(req, res){
	
	unifiedServer(req, res);
});

// start the https server
httpsServer.listen(config.httpsPort, function(){
	console.log("the server is listening in port " + config.httpsPort + " in " + config.envName + " enviroment." );
});


// Unified logic for the http and https servers.
var unifiedServer = function(req, res){
	// Get the URL and parse it.
	var parsedUrl = url.parse(req.url, true);

	// Get the URL path.
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// Get the query string as an object.
	var queryStringObject = parsedUrl.query;

	// Get HTTP Method
	var method = req.method.toLowerCase();

	// Get the headers as an object
	var headers = req.headers;

	// Get payload if any
	var decoder = new StringDecoder("utf-8");
	var buffer = "";
	req.on("data", function(data){
		buffer += decoder.write(data);
	});
	req.on("end", function(){
		buffer += decoder.end();

		// choose handler this request should go to .
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		// Construct the data object to be sent 
		var data = {
			'trimmedPath' : trimmedPath, 
			'queryStringObject' : queryStringObject,
			'method' : method, 
			'headers' : headers, 
			'payload' : buffer
		}

		// Route the request to the handler specified in the router
		chosenHandler(data, function(statusCode, payload){
			// Use the status code called back by the handler, or default to 200  
			status = typeof(statusCode) == 'number' ? statusCode : 200;

			// Use the payloasd called back by the handler or default to an empty object
			payload = typeof(payload) == 'object' ? payload : {};

			// Convert the payload to a string
			var payloadString = JSON.stringify(payload);

			// Return the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			// Log the request path.
			console.log("Returning this response: ", statusCode, payloadString);
		});
		
	});
};

// Define the handlers
var handlers = {};

// Ping Handler
handlers.ping = function(data, callback){
	callback(200);
};

// not found handler
handlers.notFound = function(data, callback){
	callback(404);
};

// Define a request router
var router = {
	'ping': handlers.ping
}
