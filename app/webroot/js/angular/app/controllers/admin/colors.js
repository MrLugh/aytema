function adminColorsCo($scope,userSv,appSv,contentSv) {

	$scope.showConfig = false;

	$scope.user 	= userSv.getUser();

	$scope.config	= {};
	$scope.configLoaded = false;

	userSv.loadThemeConfig($scope.user.theme);

	$scope.save = function() {
		userSv.setThemeConfigColors($scope.config.custom.colors);
	}

	$scope.setColor = function(color,value) {
		$scope.config.custom.colors[color].value = value;
		$scope.save();
	}	

	$scope.userSv = userSv;
	$scope.$watch("userSv.getThemeConfig()",function(config){

		if (!angular.equals($scope.config, config)) {
			$scope.config		= config;
			$scope.configLoaded = true;
		}

	},true);
	
}