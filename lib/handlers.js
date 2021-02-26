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
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: userName, email
handlers._users.post = function(data, callback){
	// Validate there is not empty parameters.
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.tirm() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.tirm() : false;
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.tirm() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.tirm() : false;
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement = true ? true : false;
};

// Users get
handlers._users.get = function(data, callback){
	
};

// Users put
handlers._users.put = function(data, callback){
	
};

// Users delete
handlers._users.delete = function(data, callback){
	
};


// Ping Handler
handlers.ping = function(data, callback){
	callback(200);
};

// not found handler
handlers.notFound = function(data, callback){
	callback(404);
};