/*
 *	This are the request handlers.
 *
 *
 */ 
// Define the handlers
var handlers = {};

// Users
handlers.users = function(data, callback){
	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if(acceptableMethods.indexOf(data.method) > -1){
		handlers._users[data.method](data, callback);
	}else{
		callback(405);
	}
};

// Container for the users.submethods
handlers._users = {};

// Users post


// Ping Handler
handlers.ping = function(data, callback){
	callback(200);
};

// not found handler
handlers.notFound = function(data, callback){
	callback(404);
};