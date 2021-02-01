/*
 *	Create and export configuration variables.
 *
 */ 

 // General container for all the enviroments.
 var enviroments = {};

 // Staging enviroment
 enviroments.staging = {
 	'port': 3000,
 	'envName': 'staging'
 };

 // Production Enviroment
 enviroments.production = {
 	'port': 5000, 
 	'envName': 'production'
 };


// Determine the enviroment to be returned
var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


// Check th current enviroment in one of the variables avobe. if not default to stagging
var enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

// export the module
module.exports = enviromentToExport;