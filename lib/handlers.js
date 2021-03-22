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
	console.log("---> Data: ", data.payload);
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
	var userName = typeof(data.payload.userName) == 'string' && data.payload.userName.trim().length > 0 ? data.payload.userName.trim() : false;
	var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
	console.log("---> fistName: ", firstName, " lastName ", lastName, " phone ", phone, " password ", password, " tosAgreement ", tosAgreement);
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
							callback(200, {'Success': 'User created successfully.'});
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
// Required data: phone
// @Todo: authenticate the user to prohibite
handlers._users.get = function(data, callback){
	// Check if the phone number is valid.
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone.trim() : false;
	if(phone){
		// Lookup the user
		_data.read('users', phone, function(err, data){
			if(!err && data){
				// remove the hashed password from the user object before returning it to the requester.
				delete data.hashedPassword;
				callback(200, data);
			}else{
				callback(404, {'Error': 'User not found'});
			}
		});	
	}else{
		callback(400, {'Error': 'Missing required field.'});
	}
};

// Users put
// Required data: phone
// Optional data: firstName, lastName, password, email, userName
// @TODO Only let the aunthenticated user to modify it data.
handlers._users.put = function(data, callback){
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	var userName = typeof(data.payload.userName) == 'string' && data.payload.userName.trim().length > 0 ? data.payload.userName.trim() : false;
	var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
	if(phone){
		if(firstName || lastName || password || userName || email){
			_data.read('users', phone , function(err, userData){
				if(!err && userData){
					// Update necesary fields.
					if(firstName){
						userData.firstName = firstName;
					}
					if(lastName){
						userData.lastName = lastName;
					}
					if(password){
						var hashedPassword = helpers.hash(password);
						userData.hashedPassword = hashedPassword;
					}
					if(userName){
						userData.userName = userName;
					}
					if(email){
						userData.email = email;
					}
					_data.update('users', phone, userData, function(err){
						if(!err){
							callback(200, {'Success': 'Record successfully updated.'});
						}else{
							console.log(err);
							callback(500, {'Error': ''});
						}
					});
				}else{
					callback(400, {'Error': 'The specified user does not exist.'});
				}
			})
		}else{
			callback(400, {'Error': 'Missing required field.'});
		}
	}else{
		callback(400, {'Error': 'Missing required field.'});
	}
};

// Users delete
// Required fields: phone.
// @TODO only allow an authenticated user delete it own data.
// @Clean up any other files associated with this user.
handlers._users.delete = function(data, callback){
	// Check
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone.trim() : false;
	if(phone){
		// Lookup the user
		_data.read('users', phone, function(err, data){
			if(!err && data){
				_data.delete('users', phone,function(err){
					if(!err){
						callback(200, {'Success': 'User successfully deleted'});
					}else{
						callback(500, {'Error':'Could not delete specified user'})
					}
				});
			}else{
				callback(404, {'Error': 'Could not find specified user.'});
			}
		});	
	}else{
		callback(400, {'Error': 'Missing required field.'});
	} 
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