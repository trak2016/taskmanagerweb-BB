var TMControllers = angular.module('TMControllers', []);

TMControllers.controller('TasksCtrl',['$scope', 'TasksService', '$routeParams', '$http', function ($scope, TaskService, $routeParams, $http) {

	Parse.initialize("zG1XiepKQw4AYekUcSGKXePvP4dRjyr4S0ZtL7wV","9ze6PNNWbPxX2rlRBmdRHHD6jXnqqPyTyTyBPJic");

	var Task = Parse.Object.extend("Task");
	var List = Parse.Object.extend("TaskList");

	$scope.taskLists = [];
	$scope.tasks = [];
	$scope.modal = {};

	console.log(List);

	$scope.expandDetails = function(task){
		task.details_expanded = (task.details_expanded) ? false : true;
	}

	$scope.getLists = function(listId){
		var query = new Parse.Query(List);
        	
		query.find({
      			success : function(results) {
				if(results.length > 0){
            				$scope.taskLists = results;
					$scope.selectedList = results[0];
					
					if(typeof listId != 'undefined'){
						for(l in results){
							if(results[l].id == listId){ $scope.selectedList = results[l]; }
						}
					}
					$scope.changeList();
				}else{
					//reloctaion to add first list page!
					window.location = '#/powitanie/';
				}
         	 	},
        	 	error: function(error) {
           		 	console.log("Error: " + error.message);
          		}
        	});

	},

	$scope.changeList = function(){
		var query = new Parse.Query(Task);
        	query.equalTo("taskList", $scope.selectedList);
        	
		query.find({
      			success : function(results) {
				var tasks = [];
				for(index in results){
					tasks.push(results[index].toJSON());
				}
            			$scope.$apply(function(){$scope.tasks = results;});
         	 	},
        	 	error: function(error) {
           		 	console.log("Error: " + error.message);
          		}
        	});
	},

	$scope.addNewList = function(){
		$scope.modal.title = "Dodaj nowe zadanie";
		$scope.list = {}
		$('#list-modal').modal('show');
		$('#list-modal .modal-footer button').hide(); //hide all buttons
		$('#list-modal .modal-footer button.modalCancelBtn').show();
		$('#list-modal .modal-footer button.modalSaveBtn').show();
	}
	
	$scope.updateListBtn = function(){
		$scope.modal.title = "Aktualizuj liste";
		$scope.list = $scope.selectedList.toJSON();
		$('#list-modal').modal('show');
		$('#list-modal .modal-footer button').hide(); //hide all buttons
		$('#list-modal .modal-footer button.modalCancelBtn').show();
		$('#list-modal .modal-footer button.modalUpdateBtn').show();
	}

	$scope.addNewTask = function(){
		$scope.modal.title = "Dodaj nowe zadanie";
		if(!$scope.selectedList){ humanMsg.displayMsg("Lista nie została wybrana."); return;}
		$scope.task = {status: 0, priority:3};
		$('#task-modal').modal('show');
		$('#task-modal .modal-footer button').hide(); //hide all buttons
		$('#task-modal .modal-footer button.modalCancelBtn').show();
		$('#task-modal .modal-footer button.modalSaveBtn').show();
	}

        $scope.updateTaskBtn = function(task){
		$scope.modal.title = "Aktualizuj zadanie";
                $scope.task = task.toJSON();
		console.log($scope.task);
                $('#task-modal').modal('show');
		$('#task-modal .modal-footer button').hide(); //hide all buttons
		$('#task-modal .modal-footer button.modalCancelBtn').show();
		$('#task-modal .modal-footer button.modalUpdateBtn').show();

        }

	$scope.saveList = function(redirect){
		//if(!$scope.validateList()){ return;}
		 new List().save($scope.list,{
			success: function(list){
				if(typeof redirect != 'undefined'){
					window.location	= redirect;	
				}else{

					$scope.taskLists.push(list);
					$scope.selectedList = list;
					$scope.changeList();
				}
			},
			error: function(error){
				console.log(error);	
			}
		});		
		
	}

	$scope.updateList = function(){
		var query = new Parse.Query(List);
		query.equalTo("objectId", $scope.list.objectId);	
		query.first({
      			success : function(list) {
				for(attr in $scope.list)
					list.set(attr, $scope.list[attr]);
				list.save({
					success:function(list){
						$scope.getLists(list.id);
					},
					error:function(error){

					}
				});	
         	 	},
        	 	error: function(error) {
           		 	console.log("Error: " + error.message);
          		}
        	});		

	}

	$scope.saveTask = function(){
		$scope.task.taskList = $scope.selectedList;
		$scope.task.priority = (typeof $scope.task.priority !== 'undefined') ? parseInt($scope.task.priority) : 3;
		new Task($scope.task).save(null, {
			success: function(task) {
				$scope.changeList();
  			},
  			error: function(task, error) {
				console.log("something gone wrong! Error:" + error);
  			}
		});
	}

	$scope.updateTask = function(){
		console.log("Attempt to update function");
		$scope.task.priority = (typeof $scope.task.priority !== 'undefined') ? parseInt($scope.task.priority) : 3;
		var query = new Parse.Query(Task);
		query.equalTo("objectId", $scope.task.objectId);	
		query.first({
      			success : function(task) {
				for(attr in $scope.task)
					task.set(attr, $scope.task[attr]);

					task.set("taskList", $scope.selectedList);
				task.save({
					success:function(task){

					},
					error:function(error){

					}
				});	
         	 	},
        	 	error: function(error) {
           		 	console.log("Error: " + error.message);
          		}
        	});		

	}

	$scope.changeStatus = function(JSONtask){
		var taskID = JSONtask.id;
		var query = new Parse.Query(Task);
		query.equalTo("objectId", taskID);
		query.first({
			success : function(task){
				if(task.get("status") == 0 ){  //if status is opened
					task.set("status", 1);	
				}else{
					task.set("status", 0);
				}

				task.save({
					success: function(task){
						$scope.$apply();
					},
					error: function(){


					}
				});
			},
			error: function(error){
		
			}
		});
	}

	$scope.getLists();
	
}]);


TMControllers.controller('UserCtrl',['$scope', 'TasksService', 'Utils', '$routeParams', '$http', function ($scope, TaskService, Utils, $routeParams, $http) {

	Parse.initialize("zG1XiepKQw4AYekUcSGKXePvP4dRjyr4S0ZtL7wV","9ze6PNNWbPxX2rlRBmdRHHD6jXnqqPyTyTyBPJic");

	validateUser = function(user){
		var valid = true;

		if(typeof user === "undefined"){ 
			valid = false; 
		} else {
			if(typeof user.username === "undefined"){ valid = false; } 
			if(typeof user.password === "undefined"){ valid = false; }
			if(typeof user.repeat === "undefined"){ valid = false; }
		}
	
		if(valid){
			if(user.password !== user.repeat){
				valid = false;
			}
	
		}

		return valid;
	},

	$scope.registerUserBtn = function(){
		if(!validateUser($scope.user)){
			return;
		}

		(new Parse.User()).signUp(Utils.copy($scope.user, ['username', 'password']) , {
			success: function(user){
				console.log("Success");
			},
			error: function(user, error){
				console.log("Error: "+error);
			}	
		});

	}


}]);
