/*
 *	Primary file for the API.
 *
 *
 */ 

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// The server should respond to all request with a string :)
var server = http.createServer(function(req, res){


	// Get the URL and parse it.
	var parsedUrl = url.parse(req.url, true);

	// Get the URL path.
	var path = parsedUrl.pathname;
	var trimedPath = path.replace(/^\/+|\/+$/g,'');

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
		choosenHandler(data, function(statusCode, payload){
			// Use the status code called back by the handler, or default to 200  
			status = typeof(statusCode) == 'number' ? statusCode : 200;

			// Use the payloasd called back by the handler or default to an empty object
			payload = typeof(payload) == 'object' ? payload : {};

			// Convert the payload to a string
			var payloadString = JSON.stringify(payload);

			// Return the response
			res.writeHead(statusCode);
			res.end(payloadString);

			// Log the request path.
			console.log("Returning this response: ", statusCode, payloadString);
		});
		
	});

});


// Start the server, and have it listen to port 3000.
server.listen(3000, function(){
	console.log("the server is listening in port 3000 now.");
});

// Define the handlers
var handlers = {};

// sample handler
handlers.sample = function(data, callback){
	// Callback a http status code and a payload object.
	callback(406, {'name': 'sample-handler'});
};

// not found handler
handlers.notFound = function(data, callback){
	callback(404);
};

// Define a request router
var router = {
	'sample': handlers.sample
}
