function usersCo($scope,appSv,userSv) {

	$scope.userSv	= userSv;

	$scope.userSearch = '';
	$scope.limit = 10;
	$scope.offset = 0;

	$scope.match = function(list,finduser) {
		for (var x in list) {
			var user = list[x];
			if (user.id == finduser.id) {
				return true;
			}
		}
		return false;
	}	

	$scope.searchUsers = function() {

		var params = {
			search:$scope.userSearch,
			limit:$scope.limit,
			offset:$scope.offset
		};

		userSv.search(params)
		.then(function(data){
			if (data.users.length>0) {
				for (var x in data.users) {
					var user = data.users[x];
					if (!$scope.match($scope.users,user['User'])) {
						$scope.users.push(user['User']);
					}
				}
				$scope.offset = data.users.length;
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