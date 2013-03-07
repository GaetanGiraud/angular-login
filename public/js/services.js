'use strict';

/* Services */


// Registering REST resources

angular.module('ExampleApp.services', ['ngResource']).
  factory('User', function($resource){
    return $resource('api/users/:userId', {userId: '@id'},
                      {update: {method: "PUT"}}
                      );
  }).value('version', '0.1');
  
 
  


