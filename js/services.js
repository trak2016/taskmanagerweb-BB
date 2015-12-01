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


TMServices.factory('Utils', function($log, $q){ 

	return{ 
		copy: function(obj, keys){
			
			if(typeof keys === 'undefined'){
				return JSON.parse(JSON.stringify(obj));
			}

			var newObj = {};

			for(var key in keys){
				newObj[keys[key]] = obj[keys[key]];
			}

			return newObj;
		},
	}
});

