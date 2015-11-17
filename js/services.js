var TMServices = angular.module('TMServices', ['ngResource']);

TMServices.factory('TasksService', function($http, $log, $q){ 
	$http.defaults.headers.common['X-Parse-Application-Id'] = 'zG1XiepKQw4AYekUcSGKXePvP4dRjyr4S0ZtL7wV';
	/*$http.defaults.headers.common['X-Parse-Master-Key'] = '5XBrCHiELoOJpMrq4rALLrejfpwmZXu5NJhxbtx6';*/
	$http.defaults.headers.common['X-Parse-REST-API-Key'] = 'VktLovB6xIEMWp21CAKeJCBsxolFZXssyYyn9qwz';

	return{ 
		getLists: function(){
			return $http.get('https://api.parse.com/1/classes/TaskList')
					.then(function(response){
						return response.data;
			});
		},
		getListTasks: function(listID){
			var where = {'Task' : {'$select' :{'query':{'taskList':listID}}}}; 
			return $http.get('https://api.parse.com/1/classes/Task')
					.then(function(response){
						return response.data;
			});
		},

	}
});

