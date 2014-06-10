function aytemaCo($scope,$location,userSv,appSv) {

	$scope.user = userSv.getUser();
	userSv.loadAccounts();

	$scope.steps= $scope.user.steps;
	$scope.userSearch= '';
	$scope.usersList = [];
	$scope.showMenu  = false;

	$scope.profileImages = [];
	$scope.currentImage  = 0;

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

	$scope.getMenuItemClass = function(step) {
		return $scope.steps[step] ? 'active' : '';
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

	$scope.logout = function() {
		window.location.href = '/users/logout';
	}

	$scope.checkStep = function() {

		if ($scope.isLogged() && $location.path() == '/themes') {
			$scope.activateStep(2);
		} else if ($scope.isLogged() && $location.path() == '/share') {
			$scope.activateStep(3);
		} else if($scope.isLogged()) {
			$scope.activateStep(1);
		}

	}
	$scope.checkStep();

	$scope.manageControl = function() {
		$scope.showMenu = !$scope.showMenu;
	}

	$scope.getHeaderClass = function() {

		if ($scope.showMenu) {

			return 'headerOpened';
		}

		return 'headerClosed';

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
				'width':'calc(100% - '+($scope.menuWidth) +'px)',
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

	$scope.initProfileImages = function() {

		$scope.profileImages = [];
		$scope.currentImage  = 0;

		for (var x in userSv.getAccounts()) {
			var account = userSv.getAccounts()[x];
			if ($scope.profileImages.indexOf(account.Socialnet.profile_image) == -1) {
				$scope.profileImages.push(account.Socialnet.profile_image);
			}
		}

		if ($scope.profileImages.indexOf($scope.user.profile_image) != -1) {
			$scope.currentImage	= $scope.profileImages.indexOf($scope.user.profile_image);
		}

	}

	$scope.getProfileImageStyle = function() {
		if ($scope.profileImages.length>0) {
			return {'background-image':'url("'+$scope.profileImages[$scope.currentImage]+'")'}
		}
		return {}
	}

	$scope.moveProfileImage = function(direction) {

		if (direction > 0) {
			$scope.currentImage++;
		} else {
			$scope.currentImage--;		
		}

		if ($scope.currentImage == $scope.profileImages.length) {
			$scope.currentImage = 0;
		}
		if ($scope.currentImage < 0) {		
			$scope.currentImage = $scope.profileImages.length - 1;
		}
		userSv.saveProfileimage($scope.profileImages[$scope.currentImage]);
	}

	$scope.$watch('userSv.getUser()',function(user){
		$scope.user = user;
		$scope.initProfileImages();
	},true);

	$scope.$watch('userSv.getAccounts()', function(value) {
		if (angular.isDefined(value) && value.length > 0) {
			$scope.initProfileImages();
		}
	});

	$scope.$watch('userSv.isLogged()',function(value){
		$scope.checkStep();
		$scope.initProfileImages();
	},true);

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
       	$scope.getMenuWidth();
    });

}