function aytemaCo($scope,$location,userSv,appSv) {

	$scope.user = userSv.getUser();
	$scope.steps= $scope.user.steps;
	$scope.userSearch= '';
	$scope.usersList = [];
	$scope.showMenu  = false;

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

	$scope.manageControl = function() {
		$scope.showMenu = !$scope.showMenu;
	}

	$scope.getHeaderStyle = function() {

		if ($scope.showMenu) {

			return {
				'left': 0
			}
		}

		return {
			'left': '-' + ($scope.menuWidth - 50) + 'px'
		}

	}

	$scope.getContentStyle = function() {

		if ($scope.showMenu) {
			return {
				'width':'calc(100% - '+($scope.menuWidth + 50) +'px)',
				'left' :$scope.menuWidth+'px'
			}
		}

		return {
			'width':'calc(100% - 50px)',
			'left':'50px'
		}

	}

	$scope.getMenuContainerStyle = function() {
		if ($scope.showMenu) {
			return {
				'left' :'0'
			}
		}

		return {
			'left':'-50px'
		}		
	}

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
       	$scope.getMenuWidth();
    });

}