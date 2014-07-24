function socialnetsCo($scope,appSv,userSv) {

	console.log("socialnets");

	$scope.userSv	= userSv;
	$scope.socialnetSearch = '';
	$scope.limit = 10;

	$scope.searchsocialnets = function() {
		userSv.loadAccounts({search:$scope.socialnetSearch}).then(function(data){
			$scope.socialnets = [];
			for (var x in data.socialnets) {
				var socialnet = data.socialnets[x];
				$scope.socialnets.push(socialnet['Socialnet']);
			}
		});
	}

	$scope.$watch('socialnetSearch', function(value) {
		$scope.searchsocialnets();
	});
}