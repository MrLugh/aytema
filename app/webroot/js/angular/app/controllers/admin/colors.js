function adminColorsCo($scope,userSv,appSv,contentSv) {

	$scope.showConfig = false;
	$scope.user 	= userSv.getUser();
	$scope.config	= $scope.$parent.config;

	$scope.colorsOnbackgroundImage = [];
	
	$scope.save = function() {
		userSv.setThemeConfigColors($scope.config.custom.colors);
	}

	$scope.setColor = function(color,value) {
		$scope.config.custom.colors[color].value = value;
		$scope.save();
	}

	$scope.saveConfig = function() {
		userSv.saveThemeConfig();
	}

	$scope.restoreConfig = function() {
		userSv.restoreConfig();
	}

	$scope.$watch("config.custom.background.selected",function(background){
		$scope.colorsOnbackgroundImage = [];

		if (background.length>0) {

			if (!angular.isDefined(contentSv.getPalleteData(background))) {
				contentSv.getPalleteFromImage(background).then(function(data){
					$scope.colorsOnbackgroundImage = data.pallete.info.colors;
					contentSv.setPalleteData(background,data.pallete.info.colors);
				});
			} else {
				$scope.colorsOnbackgroundImage = contentSv.getPalleteData(background);
			}

		}
	},true);
	
}