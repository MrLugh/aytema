function appCo($scope,appSv,userSv) {


	$scope.user = userSv.getUser();

	$scope.isLogged = function() {
		return userSv.isLogged();
	}

    $scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
    })	
}