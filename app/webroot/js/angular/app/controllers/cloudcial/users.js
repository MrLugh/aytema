function usersCo($scope,appSv,userSv) {

	$scope.userSv	= userSv;

	$scope.userSearch = '';
	$scope.limit = 10;

	$scope.searchUsers = function() {
		userSv.search({search:$scope.userSearch}).then(function(data){
			$scope.users = [];
			for (var x in data.users) {
				var user = data.users[x];
				$scope.users.push(user['User']);
			}
		});
	}

	$scope.$watch('userSearch', function(value) {
		$scope.searchUsers();
	});
}