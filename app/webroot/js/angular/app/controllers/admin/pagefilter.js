function adminPagefilterCo($scope,userSv,appSv,contentSv) {

	console.log($scope);

	$scope.showConfig = false;

	$scope.user 	= userSv.getUser();
	$scope.pages 	= [];
	$scope.current	= $scope.$parent.current;

	$scope.config	= {};
	$scope.configLoaded = false;

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	userSv.loadThemeConfig($scope.user.theme);
	userSv.loadAccounts();

	$scope.concepts = [];
	$scope.networks	= [];

	$scope.getFilters = function() {

		if (!$scope.pages.length) {
			for (var x in $scope.config.custom.filters) {
				$scope.pages.push(x);
			}
		}

		var concepts= [];
		var networks = [];
		for (var x in $scope.accounts) {
			var network = $scope.accounts[x].Socialnet.network;
			if (networks.indexOf(network) == -1) {
				networks.push(network);
			}

			for (var y in appSv.getNetworks()) {
				for (var z in appSv.getNetworks()[y].concepts) {
					var concept = appSv.getNetworks()[y].concepts[z];
					if (concepts.indexOf(concept) == -1) {
						concepts.push(concept);
					}
				}
			}

		}

		return {'concepts':concepts,'networks':networks};
	}

	$scope.setList = function() {

		$scope.filters	= $scope.getFilters();

		var concepts= [];
		var config 	= $scope.config.custom.filters[$scope.current];
		//console.log("config ",config);
		for (var x in $scope.filters.concepts) {
			var concept = $scope.filters.concepts[x];
			if (config.concepts.indexOf(concept) != -1 || config.concepts.length == 1 && config.concepts[0]=='all') {
				if (concepts.indexOf(concept) == -1) {
					concepts.push(concept);			
				}
			}
		}
		$scope.concepts = concepts;

		var networks = [];		
		for (var x in $scope.filters.networks) {
			var network = $scope.filters.networks[x];

			if (networks.indexOf(network) == -1 && (
				!angular.isDefined(config['networks']) ||
				(angular.isDefined(config['networks']) && config['networks'].indexOf(network) != -1)
				)) {

				networks.push(network);
			}

		}

		$scope.networks = networks;
	}

	$scope.filterStyle = function(item) {

		var ixConcept = $scope.concepts.indexOf(item);
		if (ixConcept != -1 ) {
			return {"opacity":"1"};
		}

		var ixNetwork = $scope.networks.indexOf(item);
		if (ixNetwork != -1 ) {
			return {"opacity":"1"};
		}
		return {"opacity":"0.3"};
	}

	$scope.filterNetwork = function(network) {

		var ixNetwork = $scope.networks.indexOf(network);
		if (ixNetwork != -1) {
			delete $scope.networks[ixNetwork];
		} else {
			$scope.networks.push(network);
		}
		$scope.save();
	}

	$scope.filterConcept = function(concept) {

		var ixConcept = $scope.concepts.indexOf(concept);
		if (ixConcept != -1) {
			delete $scope.concepts[ixConcept];
		} else {
			$scope.concepts.push(concept);
		}
		$scope.save();
	}

	$scope.save = function() {

		var networks = [];
		for (var x in $scope.networks) {
			networks.push($scope.networks[x]);
		}

		var concepts = [];
		for (var x in $scope.concepts) {
			concepts.push($scope.concepts[x]);
		}

		$scope.networks = networks;
		$scope.concepts = concepts;

		userSv.setThemeConfig($scope.current,{'concepts':$scope.concepts,'networks':$scope.networks});
		$scope.setList();
	}


	$scope.changeShowConfig = function() {
		$scope.showConfig = !$scope.showConfig;
	}

	$scope.changePage = function(page) {
		$scope.current = page;
		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.setList();
		}
		$scope.$parent.setCurrent(page);
	}

	$scope.getClassPage = function(page) {
		return $scope.current == page ? 'active' : '';
	}

	$scope.userSv = userSv;
	$scope.$watch("userSv.getThemeConfig()",function(config){
		//console.log("watch pagefilter config",$scope.config,config);
		$scope.configLoaded = true;
		$scope.config = config;

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.setList();
		}

	},true);

	$scope.$watch("$parent.current",function(page){
		$scope.changePage(page);
	},true);	

	$scope.$watch("userSv.getAccounts()",function(accounts){
		//console.log("Watch accounts ",accounts);
		$scope.accounts = accounts;
		
		if (accounts.length) {
			$scope.accountsLoaded = true;			
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.setList();
		}
	},true);

	$scope.$watch("current",function(current){
		$scope.networks = [];
		$scope.concepts = [];		
		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.setList();
		}
	},true);

	$scope.$watch("showConfig",function(show){
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