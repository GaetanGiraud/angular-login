
/*
 * Serve JSON to our AngularJS client
 */


// User Model API

var db = require('../config/database').connection
  , User = require('../models/User')(db)
  , bcrypt = require('bcrypt');

// Authenticate user
exports.authenticate = function (email, password, fn) {
  console.log('authenticating %s:%s', email, password);
  User.findOne({'email': email }, function(err, user) {
    if (err) throw err;
    if (!user) { return fn(new Error('cannot find user')); }
    // Using the bcrypt compareSync to force synchronize authorization process. 
    if (!bcrypt.compareSync(password, user.hash)) { return fn(null, new Error('invalid password')); }
    return fn(null, user);;
  });
}

// Send currentUser information back to the client.

exports.currentUser = function (req, res) {
  if (req.session.user) { // extract user id from the session
    User.findById(req.session.user, function (err, user) {
      if (!err) {
        return res.json({"email": user.email, "name": user.name, "_id": user._id}); // User logged in.
      } else {
        console.log(err.red);
        return res.send(400, err); // client logged in, but error occured while fetching the data.
      }
    });
  } else {
    res.send(401);  // User not logged in. Client logic (Showing login page) handled by Angularjs.
  }
};
 
/*
* Very Basic Restfull API. You can add, find and update an user. 
*
*/

exports.add = function (req, res) {
  console.log(('creating user: ' + req.body.stringify));
  var newUserAttrs = req.body;
  var password = newUserAttrs.password;
  
  delete newUserAttrs.password; // Don't store password
  var salt = bcrypt.genSaltSync(10);
  newUserAttrs.hash = bcrypt.hashSync(password, salt);
  
  var newUser = new User(newUserAttrs);
  
  newUser.save(function(err, user) {  // saving the user in the database
    if (!err) {
      delete user.hash; // don't send hash
      console.log(('User ' + newUser.name + ' created').green);
      return res.json({
        "_id": user._id,
        "name": user.name,
        "email": user.email,
        });
    } else {
      console.log(err.red);
      return res.send(400, err);
    }
  });
};

exports.findById = function (req, res) {
   
  User.findById(req.params.id, function (err, user) {
    if (!err) {
      return res.json({
        "_id": user._id,
        "name": user.name,
        "email": user.email,
        });
    } else {
      console.log(err.red);
      return res.send(400, err);
    }
  });
};


exports.update = function (req, res) {
  var id = req.params.id;
  User.findByIdAndUpdate(id, req.body, function(err, user) {
    if (!err) { 
      console.log(('user '+ user.name + ' updated').green);
      return res.json({
        "_id": user._id,
        "name": user.name,
        "email": user.email,
        });
    } else {
      console.log(err.red);
      return res.send(400, err);
    }
  
  });
};

