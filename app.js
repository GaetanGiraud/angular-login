
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  colors = require('colors'),
  RedisStore = require('connect-redis')(express);


var app = module.exports = express();

/* 
 * Express server configuration
 */
 
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({ store: new RedisStore({host:'127.0.0.1', port:6379}), secret: 'ourkidsarespecial' }));
  //app.use(express.session({secret: 'ourkidsarespecial'}));
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(function(req, res, next){res.send(404, 'Sorry cant find that!');}); // handling 404 errors. In prod template to be sent back.
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

/*
 * Function for Restricting access to logged in users
 */
 
restrict = function (req, res, next) {
  var exeptions = ['login', 'logout', 'home']; // define exceptions to the restriction
  var name = req.params.name;
  
  if (exeptions.indexOf(name) != -1) { // check for exception to the restriction
    next(); 
  } else {
    if (req.session.user) {
      console.log(('User with id ' + req.session.user+ ' authorized to view this page').green);
      next();
    } else {
       req.session.error = 'Access denied!';
       console.log(('Unauthorized access from ip adress: ' + req.ip).red);
       res.send(401);          
    }
  }
}


/* 
 * Routes
 */

// Angular Templates routes
app.get('/', routes.index);
app.get('/partials/:name', restrict, routes.partials);


// Session management Routes

app.get('/sessions', routes.sessions.current);
app.get('/sessions/ping', routes.sessions.ping);
app.post('/sessions/new', routes.sessions.new);
app.delete('/sessions/destroy', routes.sessions.destroy);

// Current User
app.get('/api/currentuser', api.users.currentUser);

// User registration
app.post('/api/users', api.users.add);


/*
 *  JSON API - From there on only opened for logged in users
*/ 

// user API
app.get('/api/users', restrict, api.users.findAll);
app.get('/api/users/:id',restrict, api.users.findById);
app.put('/api/users/:id', restrict, api.users.update);
app.delete('/api/users/:id', restrict, api.users.delete);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

