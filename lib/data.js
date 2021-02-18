/*
 *	Library for storing and editing data 
 *
 *
 */ 

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for this module.
var lib = {};

// Define the base folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file.
lib.create = function(dir, file, data, callback){
	// Open the file for writting
	fs.open()
};

// Export the module.
module.exports = lib;