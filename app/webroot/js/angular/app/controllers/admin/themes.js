function adminThemesCo($scope,appSv,userSv) {

	$scope.themes	= appSv.getThemes();
	$scope.user		= userSv.getUser();
	$scope.current  = -1;
	$scope.src 		= "";

	$scope.previewSrc = function(index) {
		if ($scope.current == index) {
			return false;
		}
		$scope.current = index;
		$scope.src = "http://cloudcial.com/themes?type="+$scope.list[$scope.current].key+"&username=mrlugh#/";
	}

	$scope.getContainerStyle = function() {
		return {'max-height':appSv.getHeight() - $scope.$parent.menuHeight + 'px'};
	}

	$scope.getThemeClass = function(index) {
		return ($scope.current == index) ? 'theme themeActive' : 'theme';
	}

	$scope.setList = function() {

		var list= [];
		for (x in $scope.themes) {
			theme = $scope.themes[x];
			list.push(theme);
		}

		$scope.list = list;

	}
	$scope.setList();
	if ($scope.list.length>0) {
		$scope.previewSrc(0);
	}

}