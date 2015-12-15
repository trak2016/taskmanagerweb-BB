var TMControllers = angular.module('TMControllers', []);

TMControllers.controller('TasksCtrl',['$scope', 'TasksService', '$routeParams', '$http', function ($scope, TaskService, $routeParams, $http) {

	Parse.initialize("zG1XiepKQw4AYekUcSGKXePvP4dRjyr4S0ZtL7wV","9ze6PNNWbPxX2rlRBmdRHHD6jXnqqPyTyTyBPJic");

	var Task = Parse.Object.extend("Task");
	var List = Parse.Object.extend("TaskList");
	var Milestone = Parse.Object.extend("MileStone");

	$scope.taskLists = [];
	$scope.tasks = [];
	$scope.modal = {};

	$scope.datepicker = {
  		showMeridian : true,
		minDate : new Date,
		hourStep: [1, 2, 3],
    		minuteStep: [1, 5, 10, 15, 25, 30],
		dateOptions : {
    			startingDay: 1,
    			showWeeks: false
  		}
	}


	$scope.expandDetails = function(task){
		task.details_expanded = (task.details_expanded) ? false : true;
	}

	$scope.isUserLogged = function(){
		return (!!Parse.User.current());
	}

	$scope.editMilestoneStart = function(stone){ stone.edit = true; }
	$scope.editMilestoneEnd = function(stone){ delete stone.edit; }

	$scope.getLists = function(listId){
		if(!$scope.isUserLogged()){window.location = '/#/login/'; }

		var query = new Parse.Query(List);
 		query.equalTo("user", Parse.User.current());
		
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

	$scope.taskAddDate = function(){
		if($scope.task.setDueTo){
			$scope.task.dueTo = new Date();
		}else{
			delete $scope.task.dueTo;
		}
	}


	var getTaskMilestones = function(task){
		var query = new Parse.Query(Milestone);
                query.equalTo("task", task);
                query.find({
                	success: function(milestones){
                		$scope.$apply(task.set('milestones', milestones));
                	},
                	error: function(error){
                                                
                	}                                       
                });

	}

	var deleteTaskMilestones = function(task){
		var query = new Parse.Query(Milestone);
                query.equalTo("task", task);
                query.find({
                	success: function(milestones){
                		for(stone in milestones){
					milestones[stone].destroy();
				}
			},
                	error: function(error){
                                                
                	}                                       
                });

	}

	$scope.changeList = function(){
		var query = new Parse.Query(Task);
        	query.equalTo("taskList", $scope.selectedList);
        	
		query.find({
      			success : function(results) {
				for(index in results){
					getTaskMilestones(results[index]);
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
		$scope.modal.action = "ADD";
		$scope.list = {}
		$('#list-modal').modal('show');
	}
	
	$scope.updateListBtn = function(){
		$scope.modal.title = "Aktualizuj liste";
		$scope.modal.action = "UPDATE";
		$scope.list = $scope.selectedList.toJSON();
		$('#list-modal').modal('show');
	}

	$scope.addNewTask = function(){
		$scope.modal.title = "Dodaj nowe zadanie";
		$scope.modal.action = "ADD";
		if(!$scope.selectedList){ humanMsg.displayMsg("Lista nie została wybrana."); return;}
		$scope.task = {status: 0, priority:3};
		$('#task-modal').modal('show');
	}
	
	$scope.addMilestoneBtn = function(){
		if(typeof $scope.milestone == 'undefined' || $scope.milestone == ''){
			humanMsg.displayMsg("Pole nie moze byc puste.");
			return;			
		}

		if(typeof $scope.taskMilestones === 'undefined'){ $scope.taskMilestones = [];}
		$scope.taskMilestones.push($.extend($scope.milestone, {status: 0, dueTo: new Date()}))
		$scope.milestone = '';
	}

        $scope.updateTaskBtn = function(task){
		$scope.modal.title = "Aktualizuj zadanie";
		$scope.modal.action = "UPDATE";

                $scope.task = task.toJSON();

		console.log($scope.task.dueTo);		

		if(typeof $scope.task.dueTo != 'undefined'){ 
		$scope.task.dueTo = new Date($scope.task.dueTo.iso);
		$scope.task.setDueTo = true; }

		var milestones = task.get('milestones');
		$scope.taskMilestones = [];
		if(typeof milestones !== 'undefined'){
			for(stone in milestones){
				$scope.taskMilestones.push(milestones[stone].toJSON());
			}
			delete $scope.task.milestones;
		}

		console.log($scope.task);
                $('#task-modal').modal('show');

        }



	$scope.progress = function(task){
		var milestones = task.get('milestones') || [];
		var done = 0;
		if(task.get('status') == 1) return 100;
		for(stone in milestones){ done += milestones[stone].get('status') * 1;}

		return parseInt((done / milestones.length) * 100);
	}

	$scope.saveList = function(redirect){
		if(!$scope.isUserLogged()){ return; }
		$scope.list.user = Parse.User.current();
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

	var saveTaskMilestone = function(task, milestoneJSON){
		var milestone = new Milestone(JSON.parse(angular.toJson(milestoneJSON)));
		milestone.set('task', task);
		milestone.set('dueTo', new Date());
		milestone.save();
	}

	var updateTaskMilestone = function(task, milestoneJSON){
		if(!milestoneJSON.objectId){return;}
		var query = new Parse.Query(Milestone);
		query.equalTo("objectId", milestoneJSON.objectId);	
		query.first({
      			success : function(stone) {
				for(attr in milestoneJSON)
					stone.set(attr, milestoneJSON[attr]);
				stone.set('task', task);
				stone.save();	
         	 	},
        	 	error: function(error) {
           		 	console.log("Error: " + error.message);
          		}
        	});		

	}

	var deleteTaskMilestone = function(milestoneJSON){
		if(!milestoneJSON.objectId){return;}
		var query = new Parse.Query(Milestone);
		query.equalTo("objectId", milestoneJSON.objectId);	
		query.first({
      			success : function(stone) {
				stone.destroy();
         	 	},
        	 	error: function(error) {
           		 	console.log("Error: " + error.message);
          		}
        	});		
	
	}

	var updateTaskMilestones = function(task, milestones){
		for(stone in milestones){
			if(milestones[stone].remove == true){
				if(milestones[stone].objectId){
					deleteTaskMilestone(milestones[stone]);
				}		
			}else if(milestones[stone].objectId){
				updateTaskMilestone(task, milestones[stone]);
			}else{
				saveTaskMilestone(task, milestones[stone]);
			}
		}

	}


	$scope.saveTask = function(){
		$scope.task.taskList = $scope.selectedList;
		$scope.task.priority = (typeof $scope.task.priority !== 'undefined') ? parseInt($scope.task.priority) : 3;
		
		var task = new Task($scope.task); //Create parse object from JSON object
		
		task.save(null, {
			success: function(task) {
				if(typeof $scope.taskMilestones !== 'undefined' && $scope.taskMilestones.length > 0){
					for(var i = 0; i < $scope.taskMilestones.length; i++){
						saveTaskMilestone(task, $scope.taskMilestones[i]);
					}		
				}
				$scope.taskMilestones = [];	
				$scope.changeList();
  			},
  			error: function(task, error) {
				console.log("something gone wrong! Error:" + error);
  			}
		});
	}

	
	$scope.removeMilestoneBtn = function(stone){
		stone.remove = true;
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
							updateTaskMilestones(task, $scope.taskMilestones);					
	
							$scope.taskMilestones = [];
							$scope.changeList();
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

	$scope.changeMilestoneStatus = function(milestone){
		var milestoneID = milestone.id;
		var query = new Parse.Query(Milestone);
		query.equalTo("objectId", milestoneID);

		query.first({
			success : function(stone){
				var status = stone.get("status");  
				var newStatus = (status == 0) ? 1 : 0;
				stone.set("status", newStatus);

				stone.save({
					success: function(stone){
						$scope.$apply(milestone.set('status', stone.get('status')));
					},
					error: function(){}	
				});
			},
			error: function(error){}
		});
	}
	
	$scope.logoutBtn = function(){
		Parse.User.logOut();
		window.location = '/#/login';
	}

	$scope.getLists();
}]);




TMControllers.controller('UserCtrl',['$scope', 'TasksService', 'Utils', '$routeParams', '$http', function ($scope, TaskService, Utils, $routeParams, $http) {

	Parse.initialize("zG1XiepKQw4AYekUcSGKXePvP4dRjyr4S0ZtL7wV","9ze6PNNWbPxX2rlRBmdRHHD6jXnqqPyTyTyBPJic");

	init = function(){
		$scope.changeView('login');
	}

	
	$scope.changeView = function(view){
		if($scope.view === view) return;
		$scope.view = view;
		$scope.user = {
			username: '',
			password: '',
			repeat: ''
		}
	}

	init();
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
				humanMsg.displayMsg("Poprawnie utworzono nowe konto.");
				$scope.logInUserBtn();
			},
			error: function(user, error){
			}	
		});

	}

	$scope.logInUserBtn = function(){
		Parse.User.logIn($scope.user.username, $scope.user.password, {
			success: function(user){
				window.location = '/';
				humanMsg.displayMsg("Poprawnie zalogowano.");
			},
			error: function(user, error){
				humanMsg.displayMsg("Sprawdz dane logowania");
			}
});
	}
}]);
