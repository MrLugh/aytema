function themeDigestCo($scope,appSv,userSv,contentSv) {

	$scope.contentSv = contentSv;

	$scope.user = userSv.getUser();

	$scope.list 	= [];
	$scope.offset 	= 0;
	$scope.limit	= 8;

	$scope.scroll   = 0;

	$scope.config	= {};
	$scope.configLoaded = false;

	$scope.current	= 'home';

	userSv.loadThemeConfig($scope.user.theme);

    $scope.tag = '';
    $scope.showConfig = false;

	$scope.getFilters = function() {

		var filters	= {'concepts':[],'networks':[]};

		var accounts= userSv.getAccounts();

		if (!accounts.length && !userSv.isLoading()) {
			userSv.loadAccounts();
			return filters;
		}

		//var networks= appSv.getNetworks();
		var allConcepts = [];
		var networks 	= [];
		for (var x in accounts) {
			var network = accounts[x].Socialnet.network;


			if (filters.networks.indexOf(network) == -1 && (
				!angular.isDefined($scope.config.custom.filters[$scope.current]['networks']) ||
				angular.isDefined($scope.config.custom.filters[$scope.current]['networks']) && 
				$scope.config.custom.filters[$scope.current]['networks'].indexOf(network) != -1
				)) {
				filters.networks.push(network);
			}

			for (var y in appSv.getNetworks()[network].concepts) {
				var concept = appSv.getNetworks()[network].concepts[y];
				if (allConcepts.indexOf(concept) == -1) {
					allConcepts.push(concept);
				}
			}
		}

		var concepts = $scope.config.custom.filters[$scope.current].concepts;
		if (concepts.length == 1 && concepts[0] == 'all' ) {
			filters.concepts = allConcepts;
		} else {
			filters.concepts = concepts;
		}

		return filters;
	}

	$scope.setList = function() {

		if (!contentSv.isLoading() && $scope.configLoaded) {
			var filters = $scope.getFilters();
			if (!filters.concepts.length && !filters.networks.length) {
				$scope.list = [];
				return;
			}

			var params			= JSON.parse(JSON.stringify(filters));
			params['offset']	= $scope.offset;
			params['limit']		= $scope.limit;

			contentSv.getContentsByFilters(params).then(
				function(data) {
					var contents = data.contents;
					var list = $scope.offset == 0 ? [] : $scope.list;
					for (var x in contents) {
						content = contents[x].Content;
						list.push(content);
					}
					if (!angular.equals($scope.list, list)) {
						$scope.reinitMasonry();
						$scope.list = list;
					}
				},
				function(reason) {
					console.log('Failed: ', reason);
				},
				function(update) {
					console.log('Got notification: ', update);
				}
			);
		}		
	}

	$scope.isLogged = function() {
		return userSv.isLogged();
	}

	$scope.canShowStat = function(stat) {
		return (parseInt(stat) != 0) ? true : false;
	}

	$scope.statIcon = function(stat_name) {
		return contentSv.getStatIcon(stat_name);
	}

	$scope.moreContent = function() {
		if (!contentSv.isLoading()) {
			$scope.offset += $scope.limit;
			$scope.setList();
		}
	}

	$scope.getStyle = function() {
		return {'min-height':appSv.getHeight() - $scope.getOffsetTop() + 'px'};
	}

	$scope.getMenuItemClass = function(page) {
		return ($scope.current == page) ? 'active':'';
	}

	$scope.setCurrent = function(page) {
		$scope.offset 	= 0;
		$scope.limit	= 8;
		$scope.current = page;
	}

	$scope.getContentSize = function(index) {
		var small 		= ['post','quote','chat'];
		var medium 		= ['video','track','photo'];
		var large 		= [];
		var extralarge 	= [];
		var content = $scope.list[index];

		if (small.indexOf(content.concept) != -1 ) {
			if (content.concept == 'post' && content.network == 'facebook') {
				return 'xlarge';
			}
			if (content.concept == 'post' && content.network == 'twitter') {
				return 'medium';
			}			
			return 'small';
		}
		if (medium.indexOf(content.concept) != -1 ) {
			return 'medium';
		}
		if (large.indexOf(content.concept) != -1 ) {
			return 'large';
		}
		if (extralarge.indexOf(content.concept) != -1 ) {
			return 'xlarge';
		}

	}

	$scope.userSv = userSv;
	$scope.$watch("userSv.getThemeConfig()",function(config){

		if (!angular.equals($scope.config, config)) {
			$scope.config		= config;
			$scope.configLoaded = true;
		}

		if ($scope.configLoaded) {
			$scope.setList();
		}

	},true);

	$scope.$watch("userSv.getAccounts()",function(accounts){
		$scope.setList();
	},true);

	$scope.$watch("current",function(current){
		$scope.setList();
	});

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
        $scope.getStyle();
    });

    $scope.showDirective = function(tag) {
    	$scope.tag = tag;
    	$scope.showConfig = true;
    }

    $scope.hideDirective = function() {
    	$scope.tag = "";
    	$scope.showConfig = false;
    }
}