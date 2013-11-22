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

	$scope.showingContent	= false;
	$scope.contentModal		= [];
	$scope.currentContent	= false;    

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

			console.log("DIGEST SET LIST!!!!!!!!!!!!!!!!!!!!!!!");

			contentSv.getContentsByFilters(params).then(
				function(data) {
					var contents = data.contents;
					var list = $scope.offset == 0 ? [] : $scope.list;
					for (var x in contents) {
						content = contents[x].Content;
						list.push(content);
					}
					if (!angular.equals($scope.list, list)) {
						//$scope.reinitMasonry();
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

	$scope.getAccountLink = function(index,external_user_id) {
		for (var x in userSv.getAccounts()) {
			var account = userSv.getAccounts()[x].Socialnet;
			if (account.external_user_id == external_user_id && 
				account.network == $scope.list[index].network ) {
				return account.profile_url;
			}
		}
		return '';
	}

	$scope.setCurrent = function(page) {
		$scope.list 	= [];
		//$scope.reinitMasonry();		
		$scope.offset 	= 0;
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

	$scope.showContent = function(index) {
		console.log("showing content ",index,$scope.list[index].concept);
		$scope.contentModal		= [];
		$scope.currentContent	= index;
		$scope.contentModal		= [$scope.list[index]];
		$scope.showingContent 	= true;
	}	

	$scope.closeContent = function() {
		$scope.contentModal		= [];
		$scope.showingContent 	= false;
		$scope.currentContent	= false;
	}

	$scope.move = function(direction) {

		$scope.showingContent 	= false;
		if (direction > 0) {
			$scope.currentContent++;
		} else {
			$scope.currentContent--;		
		}

		if ($scope.currentContent == $scope.list.length) {
			$scope.currentContent = 0;
		}
		if ($scope.currentContent < 0) {		
			$scope.currentContent = $scope.list.length - 1;
		}
		$scope.showContent($scope.currentContent);
	}

	$scope.getNavigatorClass = function(direction) {

		var current = $scope.currentContent;

		if (direction > 0) {
			current++;
		} else {
			current--;		
		}

		if (current == $scope.list.length) {
			current = 0;
		}
		if (current < 0) {		
			current = $scope.list.length - 1;
		}

		var content = $scope.list[current];

		return content.network+"_bg "+content.network+"_color";
	}

	$scope.getNavigatorTitle = function(direction) {

		var current = $scope.currentContent;

		if (direction > 0) {
			current++;
		} else {
			current--;
		}

		if (current == $scope.list.length) {
			current = 0;
		}
		if (current < 0) {		
			current = $scope.list.length - 1;
		}

		var content = $scope.list[current];
		return content.network+" "+content.external_user_name+" "+content.concept;
	}	

	$scope.delete = function(index) {
		contentSv.deleteContent($scope.list[index].id).
		then(function(data){
			if (data.message == "Deleted") {
				$scope.list		= [];
				$scope.offset	= 0;
				$scope.setList();
			}
		});

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