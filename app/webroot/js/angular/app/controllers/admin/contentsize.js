function adminContentsizeCo($scope,userSv,appSv,contentSv) {

	$scope.user = userSv.getUser();

	$scope.sizes = appSv.getContentSizes();

	$scope.config	= $scope.$parent.config;
	$scope.accounts	= $scope.$parent.accounts;

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
	$scope.setList();

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
		return $scope.config.custom.contentsizes[network][concept] == size ? {"opacity":"1"} : {"opacity":"0.3"};
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

	$scope.conceptIcon = function(concept) {
		return contentSv.getConceptIcon(concept);
	}

	$scope.networkIcon = function(network) {
		return "http://cloudcial.com/img/socialnet/icons/ce_"+network+".png";
	}

	$scope.saveConfig = function() {
		userSv.saveThemeConfig();
	}

	$scope.restoreConfig = function() {
		userSv.restoreConfig();
		$scope.setList();
	}	
}