function socialnetsCo($scope,appSv,userSv,contentSv) {

	$scope.userSv	= userSv;
	$scope.contentSv= contentSv;
	$scope.networks = appSv.getNetworks();

	$scope.socialnets = [];

	$scope.socialnetSearch = '';
	$scope.limit = 10;
	$scope.offset= 0;

	$scope.showFilters 	= false;

	$scope.searchSocialnets = function() {
		userSv.loadAccounts({
			status:'Allowed',
			search:$scope.socialnetSearch,
			limit:$scope.limit,
			offset:$scope.offset
		})
		.then(function(data){
			if (data.socialnets.length>0) {
				for (var x in data.socialnets) {
					var socialnet = data.socialnets[x];
					if ($scope.socialnets.indexOf(socialnet['Socialnet']) == -1) {
						$scope.socialnets.push(socialnet['Socialnet']);
					}					
				}
				$scope.offset += $scope.limit;
			}
			$scope.loading = false;
		});
	}

	$scope.moreAccounts = function() {
		$scope.searchSocialnets();
	}

	$scope.networkIcon = function(network) {
		return contentSv.getNetworkIcon(network);
	}

	$scope.canShowStat = function(stat) {
		return (parseInt(stat) != 0) ? true : false;
	}

	$scope.statIcon = function(stat_name) {
		return contentSv.getStatIcon(stat_name);
	}

	$scope.networkIcon = function(network) {
		return contentSv.getNetworkIcon(network);
	}

	$scope.manageFilters = function() {
		$scope.showFilters = !$scope.showFilters;
	}	

	$scope.initFilters = function() {

		var filters = {'networks':[]};

		for (x in $scope.networks){
			network = $scope.networks[x];
			filters['networks'].push(x);
		}

		$scope.filters = filters;

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

		$scope.searchSocialnets();
	}

	$scope.filterClass = function(network) {
		var ixNetwork = $scope.filters.networks.indexOf(network);
		if (ixNetwork == -1 ) {
			return "";
		}
		return "active";
	}

	$scope.$watch('socialnetSearch', function(value) {
		$scope.offset = 0;
		$scope.socialnets = [];
		$scope.searchSocialnets();
	});
	$scope.initFilters();
}