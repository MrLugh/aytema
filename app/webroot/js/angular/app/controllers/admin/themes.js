function adminThemesCo($scope,appSv) {

	$scope.themes = appSv.getThemes();

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