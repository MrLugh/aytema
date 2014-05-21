function aytemaCo($scope,$location,userSv) {

	$scope.user = userSv.getUser();
	$scope.steps= $scope.user.steps;
	console.log($scope.steps);

	$scope.userSearch= '';
	$scope.usersList = [];

	$scope.searchUsers = function() {
		userSv.search($scope.userSearch).then(function(data){
			$scope.usersList = [];
			for (var x in data.users) {
				var user = data.users[x];
				$scope.usersList.push(user['User']);
			}
		});
	}

	$scope.activateStep = function(step) {
		for (x in $scope.steps) {
			$scope.steps[x] = false;
		}
		$scope.steps[step] = true;
	}

	$scope.getTemplate = function(tpl) {
		return 'app/webroot/js/angular/app/templates/'+tpl;
	}

	$scope.$watch('userSearch', function(value) {
		$scope.usersList = [];
		if (value.length > 0) {
			$scope.searchUsers();
		}
	});

	$scope.isLogged = function() {
		return userSv.isLogged();
	}

	if ($scope.isLogged() && $location.path() == '/themes') {
		$scope.activateStep(2);
	} else if ($scope.isLogged() && $location.path() == '/share') {
		$scope.activateStep(3);
	} else if($scope.isLogged()) {
		$scope.activateStep(1);
	}

}