/*
 *	Create and export configuration variables.
 *
 */ 

 // General container for all the enviroments.
 var enviroments = {};

 // Staging enviroment
 enviroment.staging{
 	'port': 3000,
 	'envName': 'staging'
 };

 // Production Enviroment
 enviroment.production = {
 	'port': 5000, 
 	'envName': 'production'
 };


// Determine the enviroment to be returned
var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase();


// 7:13