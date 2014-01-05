function themesCo($scope,userSv,appSv,$routeParams) {

	$scope.user		= userSv.getUser();
	$scope.theme	= $scope.user.theme;
}