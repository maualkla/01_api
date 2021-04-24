/*
 *	Helpers for various tasks.
 *
 *
 */ 

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Container for all the helpers.
var helpers = {};


// Create a SHA 256 hash 
helpers.hash = function(str){
	if(typeof(str) == 'string' && str.length > 0){
		var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hash;
	}else{
		return false;
	}
}

// Create paseJsonToObject helper
// Parse a Json string to an object in all cases, without trowing.
helpers.parseJsonToObject = function(str){
	try{
		var obj = JSON.parse(str);
		return obj;
	}catch(e){
		return {};
	}
};


// Helper to create a random string of the lenght of the input number.
helpers.createRandomString = function(strLenght){
	strLenght = typeof(strLenght) == 'number' && strLenght > 0 ? strLenght : false;
	if(strLenght){
		// Define all posible characters we will use to create the random string.
		var possibleCharacters = 'abcdefghiklmnopqrstuvwxyz0123456789';

		// Start the final string.
		var str = '';
		for(i = 1; i <= strLenght; i++){
			// get a random character from all the possible characteres
			var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.lenght))
			// Append this character to the final string.
			str += randomCharacter;
		}

		// Return the final string.
		return str;
	}else{
		return(false);
	}
};
	









// Exports the module.
module.exports = helpers; // https://www.pirple.com/courses/take/the-nodejs-master-class/lessons/3809865-service-2-users 18:29