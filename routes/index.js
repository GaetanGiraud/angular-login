
/*
 * GET home page.
 */
var sessions = require('./sessions');

exports.sessions = sessions;

exports.index = function(req, res){
  res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};




//exports.login = function (req, res) {
//  res.render('partials/login');
//};

