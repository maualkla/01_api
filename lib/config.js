/*
 *	Create and export configuration variables.
 *
 */ 

 // General container for all the enviroments.
 var enviroments = {};

 // Staging enviroment
 enviroments.staging = {
 	'httpPort': 3000,
 	'httpsPort': 3001,
 	'envName': 'staging',
 	'hashingSecret': 'thisIsASecret',
    'maxChecks': 5
 };

 // Production Enviroment
 enviroments.production = {
 	'httpPort': 5000, 
 	'httpsPort': 5001,
 	'envName': 'production', 
 	'hashingSecret': 'thisIsAlsoASecret', 
    'maxChecks': 5
 };


// Determine the enviroment to be returned
var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


// Check th current enviroment in one of the variables avobe. if not default to stagging
var enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

// export the module
module.exports = enviromentToExport;

//openssl req rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem