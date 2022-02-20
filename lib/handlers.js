/*
 *	This are the request handlers.
 *
 *
 */ 

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');


// Define the handlers
var handlers = {};

// users
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
					_data.create('users',phone, userObject, function(err){
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
// @DONE @Todo: authenticate the user to prohibite
handlers._users.get = function(data, callback){
	// Check if the phone number is valid.
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone.trim() : false;
	if(phone){

		//Get the token from the headers.
		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
		// Verify that the given token is valid for the phone number
		handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
			if(tokenIsValid){

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
				callback(403, {'Error': 'Missing required token in headers or token is invalid.'});
			}
		});

		
	}else{
		callback(400, {'Error': 'Missing required field.'});
	}
};

// Users put
// Required data: phone
// Optional data: firstName, lastName, password, email, userName
// @DONE @TODO Only let the aunthenticated user to modify it data.
handlers._users.put = function(data, callback){
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	var userName = typeof(data.payload.userName) == 'string' && data.payload.userName.trim().length > 0 ? data.payload.userName.trim() : false;
	var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
	if(phone){
		if(firstName || lastName || password || userName || email){

			// Get the token from the headers.
			var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
			handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
				if(tokenIsValid){

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
					});

				}else{
					callback(403, {'Error': 'Missing required token in headers or token is invalid.'});
				}
			});


			
		}else{
			callback(400, {'Error': 'Missing required field.'});
		}
	}else{
		callback(400, {'Error': 'Missing required field.'});
	}
};

// Users delete
// Required fields: phone.
// @DONE @TODO only allow an authenticated user delete it own data.
// @Clean up any other files associated with this user.
handlers._users.delete = function(data, callback){
	// Check
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone.trim() : false;
	if(phone){

		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
		handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
			if(tokenIsValid){
				// Lookup the user
				_data.read('users', phone, function(err, userData){
					if(!err && data){
						_data.delete('users', phone,function(err){
							if(!err){
								// Delete each of the checks associated with the user.
								var userChecks = typeof(userData.checks) == 'object'  && userData.checks instanceof Array ? userData.checks : [];
								var checksToDelete = userChecks.length;
								if(checksToDelete > 0){
									var checksDeleted = 0;
									var deletionErrors = false;
									// Looup through the checks 
									userChecks.forEach(function(checkId){
										// Delete the check.
										_data.delete('checks', checkId, function(err){
											if(err){
												deletionErrors = true;
											}
											checksDeleted++;
											if(checksDeleted = checksToDelete){
												if(!deletionErrors){
													callback(200, {'Success': 'User checks deleted successfully'});
												}else{
													callback(500, {'Error': 'Error encountered while attempting to delete user checks. All checks may not been deleted from the system successfully.'});
												}
											}
										});
									});
								}else{
									callback(200);
								}
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
				callback(403, {'Error': 'Missing required token in headers or token is invalid.'});
			}
		});
	}else{
		callback(400, {'Error': 'Missing required field.'});
	} 
};

// Token handler
// Token
handlers.tokens = function(data, callback){

	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if(acceptableMethods.indexOf(data.method) > -1){
		handlers._tokens[data.method](data, callback);
	}else{
		callback(405);
	}
};

// Container for all Tokens submethods.
handlers._tokens = {};

// Post method.
// Required data (phone and password)
// No optional data
handlers._tokens.post = function(data, callback){
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	if(phone && password){
		// Look the user who matches that phone number,
		_data.read('users', phone, function(err,userData){
			if(!err && userData){
				// Hash the sent password 
				var hashedPassword = helpers.hash(password);
				if(hashedPassword == userData.hashedPassword){
					// If valid create a new token with a new random name and set the expiration date 1 hour in the future.
					var tokenId = helpers.createRandomString(20);
					var expires = Date.now() + 1000 * 60 * 60;
					var tokenObject = {
						'phone': phone,
						'id': tokenId,
						'expires': expires
					}
					// Store the token.
					_data.create('tokens', tokenId, tokenObject, function(err){
						if(!err){
							callback(200, tokenObject);
						}else{
							callback(500, {'Error':'Could not create the token.'});
						}
					});
				}else{
					callback(400, {'Error': 'Incorrect password.'});
				}
			}else{
				callback(400, {'Error': 'Could not find the specified user.'});
			}
		});
	}else{
		callback(400, {'Error': 'Missing required fields'});
	}
};
// Get method.
// Required data id
// No optional data
handlers._tokens.get = function(data, callback){
	// Check if the id is valid.
	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
	if(id){
		// Lookup the user
		_data.read('tokens', id, function(err, tokenData){
			if(!err && tokenData){
				callback(200, tokenData);
			}else{
				callback(404, {'Error': 'Token not found'});
			}
		});	
	}else{
		callback(400, {'Error': 'Missing required field.'});
	}
};
// Put method.
// Required fields: id, extend
// No optional fields
handlers._tokens.put = function(data, callback){
	var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
	var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
	if(id && extend){
		_data.read('tokens', id, function(err, tokenData){
			if(!err && tokenData){
				// check if the token isnt not really expired
				if(tokenData.expires > Date.now()){
					// Set the expireation an hour form now.\
					tokenData.expires = Date.now() + 1000 * 60 * 60;
					// Update the expiration date in the object.
					_data.update('tokens', id, tokenData, function(err){
						if(!err){
							callback(200, {'Success': 'Token expiration updated.'});
						}else{
							callback(500, {'Error': 'There was an error updating the token expiracy date.'});
						}
					});
				}else{
					callback(400, {'Error': 'Token expired, You need to log in again.'});
				}
			}else{
				callback('400',{'Error': 'Specified token does not exist.'});
			}
		});
	}else{
		callback(400, {'Error': 'Missing required fiels OR required fields are invalid.'});
	}
};
// Delete method.
// Required data is id.
// Optional data is none.
handlers._tokens.delete = function(data, callback){
	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
	if(id){
		// Lookup the user
		_data.read('tokens', id, function(err, data){
			if(!err && data){
				_data.delete('tokens', id,function(err){
					if(!err){
						callback(200, {'Success': 'Token successfully deleted'});
					}else{
						callback(500, {'Error':'Could not delete specified token'})
					}
				});
			}else{
				callback(404, {'Error': 'Could not find specified token.'});
			}
		});	
	}else{
		callback(400, {'Error': 'Missing required field.'});
	} 
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(id, phone, callback){
	// Lookup the token
	_data.read('tokens', id, function(err, tokenData){
		if(!err && tokenData){
			//check that the token is for the given user and is not expired.
			if(tokenData.phone == phone && tokenData.expires > Date.now()){
				callback(true);
			}else{	
				callback(false);
			}
		}else{
			callback(false);
		}
	});
}

// Checks handler
// Checks
handlers.checks = function(data, callback){

	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if(acceptableMethods.indexOf(data.method) > -1){
		handlers._checks[data.method](data, callback);
	}else{
		callback(405);
	}
};

// Container for all checks methods.
handlers._checks = {};

// Checks POST.
// Reqquired data: protocol, url, method, successCodes, timeoutSecs, 
// Optional data: none.
handlers._checks.post = function(data, callback){
	var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
	var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
	var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
	var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
	var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
	if(protocol && url && method && successCodes && timeoutSeconds){
		// get the token from the headers
		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
		// Lookup the user by reading the token.
		_data.read('tokens',token,function(err, tokenData){
			if(!err && tokenData){
				var userPhone = tokenData.phone;
				// lookup the userdata
				_data.read('users', userPhone, function(err,userData){
					if(!err && userData){
						var userChecks = typeof(userData.checks) == 'object'  && userData.checks instanceof Array ? userData.checks : [];
						//Verify that the user has less than than the number of max-checks-per-user
						if(userChecks.length < config.maxChecks){
							// Create a random id for the check 
							var checkId = helpers.createRandomString(20);
							// Create the check object, and include the usrs phne.
							var checkObject = {
								'id' : checkId, 
								'userPhone' : userPhone, 
								'protocol' : protocol, 
								'url': url, 
								'method': method, 
								'successCodes': successCodes, 
								'timeoutSeconds': timeoutSeconds
							};

							// Save the object
							_data.create('checks', checkId, checkObject, function(err){
								if(!err){
									// Add the check id to the users object.
									userData.checks = userChecks;
									userData.checks.push(checkId);
									// Save the new user data.
									_data.update('users', userPhone, userData, function(err){
										if(!err){
											// Return about the new check 
											callback(200, checkObject);
										}else{
											callback(500, {'Error': 'Could not update the user with the new check.'});
										}
									});
								}else{	
									callback(500, {"Error": "Could not create a new Check."})
								}
							});

						}else{
							callback(400, {"Error": "The user already has the maximum number of checks ( "+config.maxChecks+" )"})
						}
					}else{
						callback(403, {"Error": "Error leyendo la data del usuario (userPhone)."});
					}
				})
			}else{
				callback(403, {"Error": "Error leyendo los tokens."});
			}	
		});

	}else{
		callback(400, {"Error": "Missing required inputs, or inputs are invalid. Please try again."});
	}
};


// Checks get
// required data: id
// optional data: none
handlers._checks.get = function(data, callback){
	// Check if the id is valid.
	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length >= 20 ? data.queryStringObject.id.trim() : false;
	if(id){

		// Lookup the check.
		_data.read('checks', id, function(err, checkData){
			if(!err && checkData){

				//Get the token from the headers.
				var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
				// Verify that the given token belongs to the userwho created the check.
				handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
					if(tokenIsValid){
						// If token is valid return the check data 
						callback(200, checkData)
					}else{
						callback(403, {'Error': 'Invalid token or check belongs to another user.'});
					}
				});

			}else{
				callback(404, {"Error": "Check not found."});
			}
		});
		
	}else{
		callback(400, {'Error': 'Missing required field. :: Id required as Q param.'});
	}
};

// Checks put
// Required data: id
// Optional data: protocol, url, method, successCodes, timeoutSeconds, (one must be sent)
handlers._checks.put = function(data, callback){
	var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
	var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
	var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
	var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
	var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
	var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
	// Check to make sure id is valid
	if(id){
		// Check to make sure one or more optional fields has been sent.
		if(protocol || url || method || successCodes || timeoutSeconds){
			// Lookup the check
			_data.read('checks', id, function(err, checkData){
				if(!err && checkData){
					//Get the token from the headers.
					var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
					// Verify that the given token belongs to the userwho created the check.
					handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
						if(tokenIsValid){
							// Update the check where necessary.
							if(protocol){
								checkData.protocol = protocol;
							}
							if(url){
								checkData.url = url;
							}
							if(method){
								checkData.method = method;
							}
							if(successCodes){
								checkData.successCodes = successCodes;
							}
							if(timeoutSeconds){
								checkData.timeoutSeconds = timeoutSeconds;
							}

							// Store the new updates
							_data.update('checks', id, checkData, function(err){
								if(!err){
									callback(200, {'Success': "Check was updated. "});
								}else{
									callback(500, {'Error': 'Could not complete the Check update.'});
								}
							});
						}else{
							callback(403,{'Error': 'Provided token is invalid. '});
						}
					});
				}else{
					callback(400, {'Error': 'Check ID did not exist.'});
				}
			})
		}else{
			callback(400, {'Error': 'All optional fields are missing. Sent at list one of them to update.'});
		}
	}else{
		callback(400, {'Error': 'Missing required fields'});
	}
}

// Checks delete
// Required data: id
// Optional data: none
handlers._checks.delete = function(data, callback){
	// Check
	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
	if(id){
		// Lookup the check
		_data.read('checks', id, function(err, checkData){
			if(!err && checkData){
				var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
				handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
					if(tokenIsValid){
						// Delete the check data
						_data.delete('checks', id, function(err){
							if(!err){

								// Lookup the user
								_data.read('users', checkData.userPhone, function(err, userData){
									if(!err && userData){
										var userChecks = typeof(userData.checks) == 'object'  && userData.checks instanceof Array ? userData.checks : [];
										// Remove the deleted check from their list of checks
										var checkPosition = userChecks.indexOf(id);
										if(checkPosition > -1){
											userChecks.splice(checkPosition, 1);
											// Re-save the user's data 
											_data.update('users', checkData.userPhone, userData ,function(err){
												if(!err)
												{	callback(200, {'Success': 'Check successfully updated'}); }
												else
												{	callback(500, {'Error':'Could not updated specified check'}) }
											});
										}else{
											callback(599, {'Error': 'Could not find the check on the users object.'})
										}
									}else{
										callback(500, {'Error': 'Could not find the user who created the check.'});
									}
								});	



							}else{
								callback(500, {'Error': 'Could not delete the check data.'});
							}
						});
					}else{
						callback(403, {'Error': 'Missing required token in headers or token is invalid.'});
					}
				});
			}else{
				callback(400, {'Error': 'Check not found by the provided id.'});
			}	
		});
	}else{
		callback(400, {'Error': 'Missing required field.'});
	} 
};

// Ping Handler
handlers.ping = function(data, callback){
	callback(200, {'Service name':'01_node_api', 'Version': '0.0.8', 'Author':'preguntas.asi@gmail.com'});
};

// not found handler
handlers.notFound = function(data, callback){
	callback(404);
};

// home Handler
handlers.home = function(data, callback){
	callback(200, {'Service name':'01_node_api', 'Version': '0.0.8', 'Author':'preguntas.asi@gmail.com'});
};

// Sample return
handlers.hello = function(data, callback){
	callback(200, {"Code": "Hi", "Message": "Thanks for calling me, you earned a 200 code."});
};

// Exports the module.
module.exports = handlers
