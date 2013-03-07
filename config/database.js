/*
 * 
 * Create connection to the mongodb database.
 * Access the database connection from anywhere by calling 'require(path/to/database)'
 * @return
 * 
 */

//Connecting to the database
var mongoose = require('mongoose')
	, connection = mongoose.createConnection('mongodb://localhost/example-app');

connection.on('error', function() { 
	console.error.bind(console, 'connection error:').red;
});

exports.connection = connection;
