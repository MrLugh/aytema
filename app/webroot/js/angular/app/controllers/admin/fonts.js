function adminFontsCo($scope,userSv,appSv,contentSv) {

	$scope.showConfig = false;
	$scope.user 	= userSv.getUser();
	$scope.config	= $scope.$parent.config;

}