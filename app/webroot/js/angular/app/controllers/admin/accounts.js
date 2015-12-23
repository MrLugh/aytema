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
	$scope.scrollTop 		= 0;
	$scope.active			= -1;

	$scope.networkAdd	= '';

	$scope.addError 	= false;
	$scope.showAdd 		= false;
	$scope.showFilters 	= false;

	$scope.showDropdown = function(network) {

		$scope.addErrorMsg  = "";
		$scope.addError 	= false; 	
		if ($scope.networkAdd == network) {
			$scope.networkAdd = "";
			return;
		}
		$scope.networkAdd = network;
	}


	$scope.manageAdd = function() {
		$scope.showAdd = !$scope.showAdd;
		if (!$scope.showAdd) {
			$scope.networkAdd		= '';
		}
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

	$scope.initFilters();

	$scope.setList = function() {

		$scope.list = [];

		for (x in $scope.accounts) {
			var account = $scope.accounts[x]['Socialnet'];
			if ($scope.filters.networks.indexOf(account.network) != -1)	{
				if ($scope.matchBySearch(account)) {
					if (account.network != 'cloudcial') {
						$scope.list.push(account);
					} else {
						$scope.list.unshift(account);
					}
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

	$scope.filterClass = function(network) {
		var ixNetwork = $scope.filters.networks.indexOf(network);
		if (ixNetwork == -1 ) {
			return "";
		}
		return "active";
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
		if ($scope.list[index].network == 'cloudcial') {
			return false;
		}
		userSv.deleteAccount($scope.list[index]);
		return false;
	}

	$scope.getContainerStyle = function() {

		return {
			'min-height':appSv.getHeight() + 'px'
		};
	}	

	$scope.countByNetwork = function(network) {
		return userSv.countByNetwork(network);
	}


	$scope.getAddClass = function(network) {
		return $scope.networkAdd == network ? 'active' : '';
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

	$scope.addFollow = function(network) {

		var username = document.querySelector('input[name="userAccount"]');
		var href = "/"+network+"/addFollow?username="+username.value;

		userSv.addFollow(href).then(function(data){
			if (data.status != 'error') {
				$scope.addError = false;
				userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});
			} else {
				$scope.addError = true;
				$scope.addErrorMsg = data.status_msg;
			}
			
		});
	}

	$scope.addAccount = function(network) {

		$scope.networkAdd = '';

		var href = "/"+network+"/addAccount?action=start";
		$scope.popupAccount = false;

		var command = '$scope.popupAccount = window.open(href,"mywindow","status=0,menubar=0,resizable=0,location=0,width=910,height=550");';
		eval(command);

		var timer = setInterval(function() {
		    if($scope.popupAccount.closed) {  
		        clearInterval(timer);
				userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});
		    }  
		}, 1000);
	}

	$scope.showAccount = function(index) {
		$scope.current			= index;
		$scope.account 			= $scope.list[$scope.current];
		var element 			= angular.element(document.querySelector("#account_"+$scope.current));
		if (angular.isDefined(element) && element[0].offsetTop != 0) {
			$scope.scrollTop		= element[0].offsetTop;
		}
		$scope.showingAccount 	= true;
	}

	$scope.closeAccount = function() {
		$scope.account 			= {};
		$scope.showingAccount 	= false;
		$scope.current			= false;
		$scope.currentAccount	= [];

		$('html, body').animate({
			scrollTop: $scope.scrollTop
		}, 500);
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
	};
}