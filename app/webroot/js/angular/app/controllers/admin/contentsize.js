function adminContentsizeCo($scope,userSv,appSv,contentSv) {

	$scope.user = userSv.getUser();

	$scope.sizes = appSv.getContentSizes();

	$scope.config		= {};
	$scope.configLoaded = false;

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	userSv.loadThemeConfig($scope.user.theme);
	userSv.loadAccounts();

	$scope.currentNetwork = -1;

	$scope.networks = [];

	$scope.setList = function() {

		var networks = [];
		for (var x in $scope.accounts) {

			var network = $scope.accounts[x].Socialnet.network;
			if (networks.indexOf(network) == -1) {
				networks.push(network);
			}
		}

		$scope.networks = networks;
		if ($scope.networks.length) {
			$scope.currentNetwork = 0;
		}
	}

	$scope.isNetworkActive = function(index) {
		return $scope.currentNetwork == index;
	}

	$scope.showNetworkSizeConfig = function(index) {
		$scope.currentNetwork = index;
	}

	$scope.getNetworkStyle = function(index) {
		return $scope.isNetworkActive(index) ? {"opacity":"1"} : {"opacity":"0.3"};
	}	

	$scope.getNetworkConceptStyle = function(network,concept,size) {
		return $scope.config.custom.contentsizes[network][concept] == size ? {"opacity":"1"} : {"opacity":"0.7"};
	}

	$scope.setConceptSize = function(network,concept,size) {

		if (!angular.isDefined($scope.config.custom.contentsizes[network][concept]) ||
			$scope.config.custom.contentsizes[network][concept] == size
		) {
			return;
		}

		$scope.config.custom.contentsizes[network][concept] = size;
		$scope.save();
	}

	$scope.save = function() {
		userSv.setThemeConfigContentsizes($scope.config.custom.contentsizes);
	}

	$scope.userSv = userSv;

	$scope.$watch("userSv.getThemeConfig()",function(config){
		$scope.configLoaded = true;
		$scope.config = userSv.getThemeConfig();
	},true);


	$scope.$watch("userSv.getThemeConfig().config.custom.contentsizes",function(config){
		$scope.configLoaded = true;
		$scope.config = userSv.getThemeConfig();

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.setList();
		}

	},true);

	$scope.$watch("userSv.getAccounts()",function(accounts){	
		$scope.accounts = accounts;
		
		if (accounts.length) {
			$scope.accountsLoaded = true;			
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.setList();
		}
	},true);
	

	$scope.conceptIcon = function(concept) {
		return contentSv.getConceptIcon(concept);
	}

	$scope.networkIcon = function(network) {
		return "img/socialnet/icons/ce_"+network+".png";
	}	
}