function usersCo($scope,appSv,userSv) {

	$scope.userSv	= userSv;

	$scope.userSearch = '';
	$scope.limit = 10;
	$scope.offset = 0;

	$scope.searchUsers = function() {
		userSv.search({
			search:$scope.userSearch,
			limit:$scope.limit,
			offset:$scope.offset
		})
		.then(function(data){
			if (data.users.length>0) {
				for (var x in data.users) {
					var user = data.users[x];
					if ($scope.users.indexOf(user['User']) == -1) {
						$scope.users.push(user['User']);
					}					
				}
				$scope.offset += $scope.limit;
			}
			$scope.loading = false;
		});
	}

	$scope.moreUsers = function() {
		$scope.searchUsers();
	}


	$scope.$watch('userSearch', function(value) {
		$scope.offset = 0;
		$scope.users = [];
		$scope.searchUsers();
	});
}