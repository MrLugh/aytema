function aytemaCo($scope,userSv) {

	$scope.user = userSv.getUser();

	$scope.steps= $scope.user.steps;

	$scope.activateStep = function(step) {
		for (x in $scope.steps) {
			$scope.steps[x] = false;
		}
		$scope.steps[step] = true;
	}	


}