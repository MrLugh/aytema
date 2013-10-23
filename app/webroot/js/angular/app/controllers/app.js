function appCo($scope,userSv) {


	$scope.user = userSv.getUser();

	$scope.isLogged = function() {
		return userSv.isLogged();
	}
}