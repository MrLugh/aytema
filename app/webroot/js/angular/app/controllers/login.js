function loginCo($scope,userSv) {

	$scope.username = '';
	$scope.password = '';

	$scope.loginMessage = '';

	$scope.login = function() {
		userSv.login({username:$scope.username,password:$scope.password})
		.then(
			function(d){
				$scope.loginMessage = d.message.text;
			}
		);
		return false;
	}
}