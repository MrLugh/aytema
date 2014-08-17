function loginCo($scope,userSv) {

	$scope.username = '';
	$scope.password = '';

	$scope.loginMessage = '';

	$scope.login = function() {
		userSv.login({username:$scope.username,password:$scope.password})
		.then(
			function(d){
				console.log("loginCo login then success");
				console.log(d);
				$scope.loginMessage = "";
			},
			function(d){
				console.log("loginCo login then error");
				console.log(d);
				$scope.loginMessage = d.message.text;
			}
		);
		return false;
	}
}