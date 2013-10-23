function loginCo($scope,userSv) {

	$scope.username = '';
	$scope.password = '';

	$scope.login = function() {
		console.log($scope.username);
		console.log($scope.password);

		userSv.login({username:$scope.username,password:$scope.password})
		.then(function(d){
			console.log("loginCo login then");
			console.log(d);
		});
		return false;
	}
}