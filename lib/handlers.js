/*
 *	This are the request handlers.
 *
 *
 */ 

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');


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
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
	var userName = typeof(data.payload.userName) == 'string' && data.payload.userName.trim().length > 0 ? data.payload.userName.trim() : false;
	var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;

	if(firstName && lastName && phone && password && tosAgreement){
		// Make sure the user doesnt already exist.
		_data.read('users', phone, function(err, data){
			if(err){
				var hashedPassword = helpers.hash(password);
				
				// (If there is a hashed pass) Create the user object.
				if(hashedPassword){
					var userObject = {
						'firstName': firstName,
						'lastName': lastName,
						'phone': phone,
						'hashedPassword': hashedPassword,
						'tosAgreement': true,
						'userName': userName,
						'email': email
					};

					// Create user object.
					_data.create('users', phone, userObject, function(err){
						if(!err){
							callback(200);
						}else{
							console.log('---> There was an error: ', err);
							callback(500, {'Error': 'Could not create the user'});
						}
					});
				}else{
					callback(500, {'Error: ': ' Error hashing the password. Try again.'});
				}

			}else{
				callback(400, {'Error': 'A user is already registered with that phone. '});
			}
		});
	}else{
		callback(400, {'Error: ': 'Missing required fields.'});
	}
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

// Exports the module.
module.exports = handlers