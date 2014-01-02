function adminWidthCo($scope,userSv,appSv,contentSv) {

	$scope.showConfig = false;
	$scope.user 	= userSv.getUser();
	$scope.config	= $scope.$parent.config;

	$scope.options  = {
		'Full Width': '100%',
		'Boxed'		: '80%'
	};

	$scope.save = function() {
		userSv.setThemeConfigWidth($scope.config.custom.width);
	}

	$scope.saveConfig = function() {
		userSv.saveThemeConfig();
	}

	$scope.restoreConfig = function() {
		userSv.restoreConfig();
	}	
}