function appCo($scope,appSv,userSv) {

	$scope.isLogged = function() {
		return userSv.isLogged();
	}

	$scope.userSv = userSv;

	$scope.$watch('userSv.getUser()', function(newValue, oldValue, scope) {
		$scope.user = userSv.getUser();
	},true);

    $scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
    })
}