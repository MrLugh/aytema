function themesCo($scope,userSv,appSv,$routeParams) {

	$scope.user			= userSv.getUser();
	$scope.themeType	= $routeParams.key;
	$scope.themes 		= appSv.getThemes();
}