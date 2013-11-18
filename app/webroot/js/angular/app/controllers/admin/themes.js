function adminThemesCo($scope,appSv,userSv) {

	$scope.themes	= appSv.getThemes();
	$scope.user		= userSv.getUser();

	$scope.setList = function() {

		var list= [];
		for (x in $scope.themes) {
			theme = $scope.themes[x];
			list.push(theme);
		}

		$scope.list = list;
	}
	$scope.setList();


	$scope.preview = function(index) {
		
	}
}