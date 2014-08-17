function adminPagefilterCo($scope,userSv,appSv,contentSv) {

	$scope.showConfig = false;

	$scope.user 	= userSv.getUser();
	$scope.pages 	= [];
	$scope.current	= $scope.$parent.current;
	$scope.newPage	= '';

	$scope.config	= $scope.$parent.config;
	$scope.accounts	= $scope.$parent.accounts;

	$scope.concepts = [];
	$scope.networks	= [];

	$scope.getFilters = function() {

		$scope.pages = [];
		for (var x in $scope.config.custom.filters) {
			$scope.pages.push(x);
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
		console.log(config);
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

	$scope.canAdd = function() {
		if ($scope.newPage.length>0 && $scope.pages.indexOf($scope.newPage) == -1 ) {
			return true;
		}
		return false;
	}

	$scope.addPage = function() {

		if (!angular.isDefined($scope.config.custom.filters[$scope.newPage])) {
			$scope.config.custom.filters[$scope.newPage] = $scope.getFilters();
			$scope.changePage($scope.newPage);
		}
	}

	$scope.deletePage = function() {
		delete $scope.config.custom.filters[$scope.current];
		for (var x in $scope.pages) {
			if ($scope.pages[x] != $scope.current) {
				$scope.changePage($scope.pages[x]);
				break;
			}
		}
		$scope.setList();
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

		userSv.setThemeConfigFilters($scope.current,{'concepts':$scope.concepts,'networks':$scope.networks});
		$scope.setList();
	}


	$scope.changeShowConfig = function() {
		$scope.showConfig = !$scope.showConfig;
	}

	$scope.changePage = function(page) {
		$scope.current = page;
		$scope.setList();
		$scope.$parent.setCurrent(page);
	}

	$scope.getClassPage = function(page) {
		return $scope.current == page ? 'active' : '';
	}

	$scope.$watch("$parent.current",function(page){
		if (page != $scope.current) {
			$scope.changePage(page);
		}
	},true);	

	$scope.$watch("current",function(current){
		$scope.networks = [];
		$scope.concepts = [];		
		$scope.setList();
	},true);

	$scope.$watch("showConfig",function(show){
		$scope.setList();
	},true);	

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