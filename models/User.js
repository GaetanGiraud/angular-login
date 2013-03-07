//Declaring user mongoose schema and model
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    	name: String,
			email: String,
      hash: String,
		});
  
mongoose.model('User', userSchema);

module.exports = function (connection) {
  return (connection || mongoose).model('User')
}
