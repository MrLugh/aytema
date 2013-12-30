function adminColorsCo($scope,userSv,appSv,contentSv) {

	$scope.showConfig = false;
	$scope.user 	= userSv.getUser();
	$scope.config	= $scope.$parent.config;

	$scope.save = function() {
		userSv.setThemeConfigColors($scope.config.custom.colors);
	}

	$scope.setColor = function(color,value) {
		$scope.config.custom.colors[color].value = value;
		$scope.save();
	}
	
}