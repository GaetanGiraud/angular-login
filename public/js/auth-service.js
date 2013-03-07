  /**
 * @license Auth Service
 * (c) 2013 Gaetan Giraud
 * License: MIT
 * 
 * Inspired by Witold Szczerba's Angular Auth.
 * 
 */
 
angular.module('auth-service', []).
    /*
     *  This factory handles the Login - Logout logic.
     *  It saves the current user into the $rootScope.currentUser model.
     *  It uses the Angula-UI bootstrap implementation for the $dialog directive . http://angular-ui.github.com/bootstrap/
    */
   factory('AuthService', ['$http', '$rootScope', '$dialog', function($http, $rootScope, $dialog) {
  
    return {
      // calls the server to check the credentials, store the result into the currentUser global variable
      // and execute call back
      login: function(credentials, callback) {
        $http({method: 'POST', url: '/sessions/new', data: credentials}).
          success(function(data, status, headers, config) {
            $rootScope.currentUser = data;
            $rootScope.loggedIn = true; 
            return callback(true);
          }).
          error(function(data, status, headers, config) {
            return callback(false);
          });
      },
      // asks the server to destroy the session and reset global variables
      logout: function() {  
        $http.delete('/sessions/destroy', {}); 
         $rootScope.currentUser = null; 
         $rootScope.loggedIn = false; 
      },
      // asks the server to resend the session information. If session expired, 
      // servers sends error 401, triggering the http 401 interceptor.
      currentUser: function() { 
        $http.get('/api/currentuser')
        .success(function(user) {
          $rootScope.currentUser = user;
          $rootScope.loggedIn = true; 
        });
      },
      // call the login modal
      loginModal: function(callback) {
        var opts = {
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          templateUrl:  'partials/login',
          controller: 'DialogCtrl'
        };
       
        var d = $dialog.dialog(opts);
        d.open().then(function(result){
          callback(result);
        });
      }
    };
  }]).
   /**
   * Holds all the requests which failed due to 401 response,
   * so they can be re-requested in the future, once login is completed.
   */
  factory('requests401', ['$injector', function($injector) {
    var buffer = [];
    var $http; //initialized later because of circular dependency problem
    function retry(config, deferred) {
      $http = $http || $injector.get('$http');
      $http(config).then(function(response) {
        deferred.resolve(response);
      });
    }
  
    return {
      add: function(config, deferred) {
        buffer.push({
          config: config, 
          deferred: deferred
        });
      },
      retryAll: function() {
        for (var i = 0; i < buffer.length; ++i) {
          retry(buffer[i].config, buffer[i].deferred);
        }
        buffer = [];
      },
      bufferLength: function() {
        return buffer.length;
      }
    }
  }]).
 
  /**
   * $http interceptor.
   * On 401 response - it stores the request and broadcasts 'event:angular-auth-loginRequired'.
   */
  config(function($httpProvider) {
    var interceptor = function($rootScope, $q, requests401) {
      function success(response) {
        return response;
      }
 
      function error(response) {
        var status = response.status;
 
        if (status == 401) {
          var deferred = $q.defer();
          requests401.add(response.config, deferred);
          if(requests401.bufferLength() < 2) { // Only send a loginRequired event on the first intercepted 401 message.
            $rootScope.$broadcast('event:angular-auth-loginRequired');
          }
          return deferred.promise;
        }
        // otherwise
        return $q.reject(response);
      }
 
      return function(promise) {
        return promise.then(success, error);
      }
 
    };
    $httpProvider.responseInterceptors.push(interceptor);
  });
