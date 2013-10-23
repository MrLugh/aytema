function adminAccountsCo($scope,userSv,appSv) {

	$scope.user 	= userSv.getUser();
	$scope.networks = appSv.getNetworks();

	$scope.accounts = $scope.list = userSv.getAccounts();

	$scope.search 	= '';
	$scope.filters 	= {};
	
	$scope.initFilters = function() {

		$scope.filters = {'networks':[]};

		for (x in $scope.networks){
			network = $scope.networks[x];
			$scope.filters['networks'].push(x);
		}

	}
	$scope.initFilters();

	$scope.setList = function() {

		var list= [];
		for (x in $scope.accounts) {

			account = $scope.accounts[x];
			if ($scope.filters.networks.indexOf(account.network) != -1)	{

				if ($scope.matchBySearch(account)) {
					list.push(account);
				}

			}
		}

		$scope.list = list;

	}

	$scope.filter = function(index) {

		var account = $scope.networks[index];
		var networks= $scope.networks;

		var ixNetwork = $scope.filters.networks.indexOf(account.network);

		if (ixNetwork != -1) {
			delete $scope.filters.networks[ixNetwork];
		} else {
			$scope.filters.networks.push(account.network);
		}

	}

	$scope.getFilterStyle = function(network) {
		var ixNetwork = $scope.filters.networks.indexOf(network);
		if (ixNetwork == -1 ) {
			return {"opacity":"0.3"};
		}
		return {"opacity":"1"};
	}

	$scope.matchBySearch = function(account) {

		if (!$scope.search.length) {
			return true;
		}

		var search = $scope.search.toLowerCase();

		if (account.login.toLowerCase().indexOf(search) != -1 || 
			account.external_user_id.toLowerCase().indexOf(search) != -1 || 
			account.type.toLowerCase().indexOf(search) != -1 ||
			account.network.toLowerCase().indexOf(search) != -1
			) {

			return true;
		}

		return false;
	}

	$scope.delete = function(index) {
		console.log("delete");
		userSv.deleteAccount(index);
	}

	$scope.syncAccount = function(network) {
		console.log("syncAccount ",network);
	}

	$scope.countByNetwork = function(network) {
		return userSv.countByNetwork(network);
	}

	$scope.userSv = userSv;

	$scope.$watch('search', function(value) {
		$scope.setList();
	});

	$scope.$watch('filters', function(value) {
		$scope.setList();
	},true);

	$scope.$watch('userSv.getAccounts()', function(value) {
		console.log("watch userSv.getAccounts()");
		console.log(value);
		$scope.accounts = value;
		$scope.setList();
	},true);
}