function adminBackgroundCo($scope,userSv,appSv,contentSv) {

	$scope.showConfig = false;
	$scope.user 	= userSv.getUser();
	$scope.config	= $scope.$parent.config;

	$scope.newBg	= {name:'',img:''};

	$scope.saveConfig = function() {
		userSv.saveThemeConfig();
	}

	$scope.restoreConfig = function() {
		userSv.restoreConfig();
	}

	$scope.canAdd = function() {

		if ($scope.newBg.img.length>0 && $scope.newBg.name.length>0) {
			return true;
		}
		return false;
	}

	$scope.addBackground = function() {
		var bg = {};
		bg[$scope.newBg.name] = $scope.newBg.img;
		if (!angular.isDefined($scope.config.custom.background.list[bg])) {
			$scope.config.custom.background.list[$scope.newBg.name] = $scope.newBg.img;
		}
	}	

}