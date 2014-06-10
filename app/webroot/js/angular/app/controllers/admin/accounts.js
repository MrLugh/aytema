function adminAccountsCo($scope,userSv,appSv,contentSv) {

	$scope.user 	= userSv.getUser();
	$scope.networks = appSv.getNetworks();

	$scope.list		= [];
	$scope.accounts = [];

	$scope.search 	= '';
	$scope.filters 	= {};

	$scope.showingAccount	= false;
	$scope.account			= {};
	$scope.current			= false;


	$scope.showAdd 		= false;
	$scope.showFilters 	= false;

	$scope.manageAdd = function() {
		$scope.showAdd = !$scope.showAdd;
	}

	$scope.manageFilters = function() {
		$scope.showFilters = !$scope.showFilters;
	}

	$scope.initFilters = function() {

		var filters = {'networks':[]};

		filters = {'networks':[]};

		for (x in $scope.networks){
			network = $scope.networks[x];
			filters['networks'].push(x);
		}

		$scope.filters = filters;

	}
	$scope.initFilters();
	userSv.loadAccounts();

	$scope.setList = function() {

		$scope.list = [];
		for (x in $scope.accounts) {
			var account = $scope.accounts[x]['Socialnet'];
			if ($scope.filters.networks.indexOf(account.network) != -1)	{
				if ($scope.matchBySearch(account)) {
					$scope.list.push(account);
				}
			}
		}
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

		$scope.setList();
	}

	$scope.filterStyle = function(network) {
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
			account.type.toLowerCase().indexOf(search) != -1
			) {

			return true;
		}

		return false;
	}

	$scope.delete = function(index) {
		if ($scope.list[index].network == 'aytema') {
			return false;
		}
		userSv.deleteAccount($scope.list[index]);
		return false;
	}

	$scope.getContainerStyle = function() {

		return {
			'min-height':appSv.getHeight() - $scope.getOffsetTop()  - $scope.$parent.menuHeight + 'px'
		};
	}	

	$scope.countByNetwork = function(network) {
		return userSv.countByNetwork(network);
	}

	$scope.userSv = userSv;

	$scope.$watch('search', function(value) {
		$scope.setList();
	});

	$scope.$watch('userSv.getAccounts()', function(value) {
		if (angular.isDefined(value) && value.length > 0) {
			$scope.accounts = value;
			$scope.setList();
		}
	},true);

	$scope.networkIcon = function(network) {
		return contentSv.getNetworkIcon(network);
	}

	$scope.canShowStat = function(stat) {
		return (parseInt(stat) != 0) ? true : false;
	}

	$scope.statIcon = function(stat_name) {
		return contentSv.getStatIcon(stat_name);
	}

	$scope.addAccount = function(network) {

		if (network == 'aytema') {
			return false;
		}

		var href = "/"+network+"/addAccount?action=start";
		$scope.popupAccount = false;

		var command = '$scope.popupAccount = window.open(href,"mywindow","status=0,menubar=0,resizable=0,location=0,width=910,height=550");';
		eval(command);

		var timer = setInterval(function() {   
		    if($scope.popupAccount.closed) {  
		        clearInterval(timer);
				userSv.loadAccounts();
		    }  
		}, 1000);
	}

	$scope.showAccount = function(index) {
		$scope.current			= index;
		$scope.account 			= $scope.list[$scope.current];
		$scope.showingAccount 	= true;
	}

	$scope.closeAccount = function() {
		$scope.account 			= {};
		$scope.showingAccount 	= false;
		$scope.current			= false;
		$scope.currentAccount	= []
	}

	$scope.move = function(direction) {

		if (direction > 0) {
			$scope.current++;
		} else {
			$scope.current--;		
		}

		if ($scope.current == $scope.list.length) {
			$scope.current = 0;
		}
		if ($scope.current < 0) {		
			$scope.current = $scope.list.length - 1;
		}
		$scope.showAccount($scope.current);
	}
}