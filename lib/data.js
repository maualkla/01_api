/*
 *	Library for storing and editing data 
 *
 *
 */ 

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers')

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
							callback('Error (data 03); Description: Error closing the file.');
						}
					});
				}else{
					callback('Error (data 02); Description: Error writing in file.');
				}
			})
		}else{
			callback('Error (data 01); Description: Could not create new file, it may already exist.');
		}
	});
};

// Read data to a file 
lib.read = function(dir, file, callback){
	fs.readFile(lib.baseDir+dir+"/"+file+'.json', 'utf8', function(err, data){
		if(!err && data){			
			var parsedData = helpers.parseJsonToObject(data);
			callback(false, parsedData);
		}else{
			callback(err, data);
		}
	});
};

// Udpate data  inside the file
lib.update = function(dir, file, data, callback){
	// Open the file
	fs.open(lib.baseDir+dir+"/"+file+'.json', 'r+', function(err, fileDescriptor){
		if(!err && fileDescriptor){
			// Convert data to string
			var stringData = JSON.stringify(data);
			// Truncate the file (using ftruncate instead truncate)
			fs.ftruncate(fileDescriptor, function(err){
				if(!err){
					// Write to the file and close it 
					fs.writeFile(fileDescriptor, stringData, function(err){
						if(!err){
							fs.close(fileDescriptor, function(err){
								if(!err){
									callback(false);
								}else{
									callback('Error closing the file');
								}
							})
						}else{
							callback('Error writing to existing file.');
						}
					})
				}else{
					callback('Error truncating file');
				}
			})
		}else{
			callback('Error (data 01); Description: Could not open the file for update, it may not exist yet');
		}
	})
}


// Delete a file.
lib.delete = function(dir, file, callback){
	// Unlink
	fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
		if(!err){
			callback(false);
		}else{
			callback('Error deleting file.');
		}	
	})
};

// Export the module.
module.exports = lib;