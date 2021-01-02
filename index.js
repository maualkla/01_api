/*
 *	Primary file for the API.
 *
 *
 */ 

// Dependencies
const http = require("http");
const url = require("url");

// The server should respond to all request with a string :)
var server = http.createServer(function(req, res){


	// Get the URL and parse it.
	var parsedUrl = url.parse(req.url, true);

	// Get the URL path.
	var path = parsedUrl.pathname;
	var trimedPath = path.replace(/^\/+|\/+$/g,'');

	// Get HTTP Method
	var method = req.method.toLowerCase();

	// Send the response.
	res.end("Hello world!\n");

	// Log the request path.
	console.log(" Request received on path: " + trimedPath + " whith this method: " + method);
});


// Start the server, and have it listen to port 3000.
server.listen(3000, function(){
	console.log("the server is listening in port 3000 now.");
});
