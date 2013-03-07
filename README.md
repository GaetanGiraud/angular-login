# Angular JS Auth Example App

This is an example app for an Angular JS Authentification mechanism, including server side set-up.

While very simple in set up, the goal is here to show a working implementation of Authentification with Angular.
 
## Server side:
    - a nodejs / express server
    - mongoDB and mongoose ORM for data persistance
    - redis (used as a session store)
    - Angular-Ui twitter bootstrap for styling

So you need to have those installed on your machine (Angular-ui does not require any action on your side)

##Directory
The repository includes the following files:

    app.js              --> Express app
    package.json        --> for npm
    config/
      database.js       --> database configuration. Edit to match your local setup.
    model/
      User.js           --> Mongoose user model definition.
    public/
      css/              --> Css files. Include twitter bootstrap for some styling.
      images/           --> Include icons for bootstrap.
      js/
        libs/           --> Angular, Angular-bootstrap libs
        app.js          --> Routing, global variables and $rootScope event listener
        auth-service    --> The actual authentification angular service. 
                                     Uses the angular-ui bootstrap $dialog directive.
        controllers.js  --> Angular controllers.
        directives.js   --> Angular directives.
        filters.js      --> Angular filters.
        services.js     --> Angular services.
    routes/
      api.js            --> Group the api logic in one place.
      users.js          --> The actual User API.
      index.js          --> route index for express templates.
      sessions.js       --> handle session logic on the server side
    views/
      index.jade        --> Application index. Include the script tags linking to Angular libs
      layout.jade       --> Application layout.
      partials/         --> Angular partials
      
      
# How to Use

## Install

- Clone the repo into a folder of your choice.
- Make sure that `node` and at least `mongoDB` are installed. Leave them to the default configuration.
- Run `npm install` to install the packages. All dependencies are listed in the package.json.
- Run `node app.js`
- Navigate to `localhost:3000/home`. A login modal should appear asking to login / register.

## Redis Session Store
Express (through Connect) comes with its own in-memory session store. 
This configuration is not to be used in production! (As Connect will remind you if you try to!)

Therefore, and because it really is not difficult to set up, the default configuration includes Redis as the default session store.
To use the Express session store, in app.js:
- comment:

      app.use(express.session({ store: new RedisStore({host:'127.0.0.1', port:6379}), secret: 'secret' }));
      
      
- uncomment:

      //app.use(express.session({secret: 'secret'}));
      

## Basic Auth Functionality

Basic auth functionatility which are present in the app includes:
- Authorization is managed on the Server side through sessions and a User / Password mechanisme (with salt based encryption).
- 401 Interceptor is defined in Angular. When the server sends back a 401 - Not authorized message, it is intercepted and the app presents a login modal.
- CurrentUser information. CurrentUser status is stored in the $rootScope. A ping functionality ensure that this value stays synchronized with the server.



# Contact

Contact me using the comments if you need some help, or if you want to contribute!.

For more information on AngularJS please check out http://angularjs.org/
For more on Express and Jade, http://expressjs.com/ and http://jade-lang.com/ are
your friends.
