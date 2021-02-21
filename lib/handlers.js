/*
 *	This are the request handlers.
 *
 *
 */ 
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