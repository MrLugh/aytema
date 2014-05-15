function aytemaCo($scope,$location,userSv,appSv) {

	$scope.user = userSv.getUser();
	$scope.steps= $scope.user.steps;

	$scope.userSearch= '';
	$scope.usersList = [];

	$scope.showMenu = true;

	$scope.adminMenu = function() {
		$scope.showMenu = !$scope.showMenu;
	}

	$scope.getContainerStyle = function() {

		if ($scope.showMenu) {
			return {
				'padding-left': '20%',
				//'min-height': appSv.getHeight()+'px',
			};
		}
		return {
			'padding-left': '0%',
			//'min-height': appSv.getHeight()+'px',
		};

	}

	$scope.getHeaderStyle = function() {

		if ($scope.showMenu) {
			return {'left':'0'};
		}
		return {'left':'-20%'};

	}	

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
	} else if ($scope.isLogged() && $location.path() == '/accounts') {
		$scope.activateStep(1);
	} else if($scope.isLogged()) {
		$location.path("/accounts");
		$scope.activateStep(1);
	}

}