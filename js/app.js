var app = angular.module('TaskManagerApp', [
	'ngRoute',
	'TMControllers',
	'TMServices',
	'TMDirectives'
]);


app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/tasks.html',
        controller: 'TasksCtrl'
      }).
      when('/powitanie/', {
	templateUrl: 'partials/firstlist.html',
	controller: 'TasksCtrl'
      }).
      when('/login/',{
		templateUrl: 'partials/userpage.html',
		controller: 'UserCtrl'
      }).
      otherwise({
        redirectTo:'/'
      });

	//$locationProvider.html5Mode(true);
  }]);
