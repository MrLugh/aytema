function adminWidthCo($scope,userSv,appSv,contentSv) {

	$scope.showConfig = false;
	$scope.user 	= userSv.getUser();
	$scope.config	= $scope.$parent.config;

	$scope.save = function() {
		userSv.setThemeConfigWidth($scope.config.custom.width);
	}

	$scope.setWidth = function(width) {
		$scope.config.custom.width = width;
		$scope.save();
	}	

	
}