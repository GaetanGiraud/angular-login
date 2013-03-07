'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('ExampleApp', ['ExampleApp.filters', 'ExampleApp.services', 'ExampleApp.directives', 'ui.bootstrap', 'auth-service']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/home', controller: HomeCtrl});
    $routeProvider.when('/logout', {templateUrl: 'partials/logout', controller: LogoutCtrl});
    
    //Restricted partials
    $routeProvider.when('/home', {templateUrl: 'partials/userhome', controller: UserCtrl}); 
    $routeProvider.when('/user', {templateUrl: 'partials/user', controller: UserCtrl}); 
    // parameters
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);


app.run(['$rootScope', '$location', 'AuthService', 'requests401', function ($rootScope, $location, AuthService, requests401) {
    //global variables
    $rootScope.currentUser = null; 
    $rootScope.loggedIn = false; 
    
    //watching the value of the currentUser variable.
    
    $rootScope.$watch('currentUser', function(currentUser) {
      if (!currentUser && (['/', '/login', '/logout'].indexOf($location.path()) == -1 )) { 
        AuthService.currentUser(); 
        }
    });

    // On catching 401 errors, present the login modal.
    $rootScope.$on('event:angular-auth-loginRequired', function() {
      AuthService.loginModal(function(result) {
        if(result) { return requests401.retryAll(); }
        $location.path('/');
        return false;
      });
    });
}]);

