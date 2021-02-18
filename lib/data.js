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
	fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
		if(!err && fileDescriptor){
			// Convert data to string
			var stringData = JSON.stringify(data);
			// Write to file and close it, 
			fs.writeFile(fileDescriptor, stringData, function(err){
				if(!err){
					fs.close(fileDescriptor, function(err){
						if(!err){
							callback(false);
						}else{
							callback('Error (data 03); Description: Error closing the file.', err);
						}
					});
				}else{
					callback('Error (data 02); Description: Error writing in file.', err);
				}
			})
		}else{
			callback('Error (data 01); Description: Could not create new file, it may already exist.', err);
		}
	});
};

// Export the module.
module.exports = lib;