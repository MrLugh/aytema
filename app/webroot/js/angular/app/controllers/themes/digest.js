function themeDigestCo($scope,appSv,userSv,contentSv) {

	$scope.contentSv = contentSv;

	$scope.user = userSv.getUser();

	$scope.list 	= [];
	$scope.offset 	= 0;
	$scope.limit	= 10;

	$scope.scroll   = 0;

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	$scope.config	= {};
	$scope.configLoaded = false;

	$scope.current	= 'photos';
	$scope.pages 	= [];

	userSv.loadThemeConfig($scope.user.theme);
	userSv.loadAccounts();

    $scope.showConfig = false;

	$scope.showingContent	= false;
	$scope.contentModal		= [];
	$scope.currentContent	= false;
	$scope.relateds			= [];

	$scope.contentShadow = false;

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

			//var params			= JSON.parse(JSON.stringify(filters));
			var params			= [];
			params['concepts']	= JSON.parse(JSON.stringify(filters.concepts));
			params['offset']	= $scope.offset;
			params['limit']		= $scope.limit;
			//params['external_user_id'] = [];
			params['accounts'] = [];

			for (var x in userSv.getAccounts()) {
				var account = userSv.getAccounts()[x].Socialnet;
				if (filters.networks.indexOf(account.network) != -1) {
					params['accounts'].push(account.id);
				}
			}

			contentSv.getContentsByFilters(params).then(
				function(data) {
					var contents = data.contents;
					if (data.contents.length) {
						for (var x in contents) {
							content = contents[x].Content;
							$scope.list.push(content);
						}
						$scope.offset += $scope.limit;

						/*
						if ($scope.list.length) {
							$scope.contentModal		= [];
							$scope.currentContent	= 0;
							$scope.contentModal		= [$scope.list[$scope.currentContent]];
						} else {
							$scope.showingContent	= false;
							$scope.contentModal		= [];
							$scope.currentContent	= false;
						}
						*/
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

	$scope.getProfileImg = function() {
		var external_user_id = $scope.list[$scope.currentContent].external_user_id;
		for (var x in userSv.getAccounts()) {
			var account = userSv.getAccounts()[x].Socialnet;
			if (account.external_user_id == external_user_id && 
				account.network == $scope.list[$scope.currentContent].network ) {
				return account.profile_image;
			}
		}
		return '';
	}

	$scope.getCurrentProperty = function(key) {
		return $scope.list[$scope.currentContent][key];
	}

	$scope.setCurrent = function(page) {

		if ($scope.current == page) {
			return;
		}

		$scope.list 	= [];
		$scope.reinitMasonry();
		$scope.offset 	= 0;
		$scope.current = page;
		$scope.showingContent 	= false;
	}

	$scope.movePage = function(direction) {

		var indexCurrent = $scope.pages.indexOf($scope.current);

		if (direction > 0) {
			indexCurrent++;
		} else {
			indexCurrent--;
		}

		if (indexCurrent == $scope.pages.length) {
			indexCurrent = 0;
		}
		if (indexCurrent < 0) {		
			indexCurrent = $scope.pages.length - 1;
		}

		$scope.setCurrent($scope.pages[indexCurrent]);
	}

	$scope.getPageArrowTitle = function(direction) {

		var indexCurrent = $scope.pages.indexOf($scope.current);

		if (direction > 0) {
			indexCurrent++;
		} else {
			indexCurrent--;
		}

		if (indexCurrent == $scope.pages.length) {
			indexCurrent = 0;
		}
		if (indexCurrent < 0) {		
			indexCurrent = $scope.pages.length - 1;
		}

		return $scope.pages[indexCurrent];
	}	

	$scope.getContentSize = function(index) {

		var content = $scope.list[index];

		if (angular.isDefined($scope.config.custom.contentsizes[content.network][content.concept])) {
			return $scope.config.custom.contentsizes[content.network][content.concept];
		}

		if (angular.isDefined($scope.config.default.contentsizes[content.network][content.concept])) {
			return $scope.config.default.contentsizes[content.network][content.concept];
		}

		return 'small';
	}

	$scope.loadRelatedContent = function(content) {

		$scope.relateds			= [];

		var params = [];
		params['id']		= content.id;
		params['network']	= content.network;
		params['concept']	= content.concept;
		params['external_user_id'] = content.external_user_id;

		contentSv.getRelatedContent(params).then(
			function(data) {
				var contents = data.contents;
				if (data.contents.length) {
					for (var x in contents) {
						content = contents[x].Content;
						$scope.relateds.push(content);
					}
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

	$scope.showContent = function(index) {
		$scope.currentContent	= index;
		$scope.contentModal		= [$scope.list[index]];
		$scope.showingContent 	= true;
		$scope.relateds			= [];
		$scope.loadRelatedContent($scope.list[index]);
	}

	$scope.showRelated = function(index) {
		$scope.contentModal		= [$scope.relateds[index]];
		$scope.showingContent 	= true;
		$scope.loadRelatedContent($scope.relateds[index]);
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

	$scope.getNavigatorNetwork = function(direction) {

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
		return content.network;
	}

	$scope.getNavigatorThumbnail = function(direction) {

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

		if (angular.isDefined(content)) {
			return contentSv.getThumbnail(content);
		}

		return '';
	}

	$scope.getRelatedThumbnail = function(index) {
		var content = $scope.relateds[index];
		return contentSv.getThumbnail(content);
	}

	$scope.getNavigatorConceptIcon = function(direction) {

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

		if (angular.isDefined(content)) {
			return contentSv.getConceptIcon(content.concept);
		}

		return '';
	}	

	$scope.delete = function(index) {
		contentSv.deleteContent($scope.list[index].id).
		then(function(data){
			if (data.message == "Deleted") {
				$scope.removeFromMasonry($scope.list[index]);
				$scope.list.splice(index,1);
			}
		});
	}

	$scope.getModalBackgroundStyle = function() {
		return {'background-color':$scope.config.custom.colors.background.value};
	}

	$scope.getContentStyle = function() {
		return {
			'background-color':$scope.config.custom.colors.contentBackground.value,
			'color':$scope.config.custom.colors.contentText.value
		};
	}

	$scope.setBackgroundColor = function() {

		var element = angular.element(document.querySelector('body'));
		$(element[0]).css('background-color',$scope.config.custom.colors.background.value);
	}	

	$scope.userSv = userSv;
	$scope.$watch("userSv.getThemeConfig()",function(config){
		if (!angular.equals($scope.config, config)) {
			$scope.config		= config;
			$scope.configLoaded = true;

			if ($scope.accountsLoaded) {

				for (var x in $scope.config.custom.filters) {

					if (!angular.isDefined($scope.config.custom.filters[x]['networks'])) {
						var networks = [];
						for (var y in userSv.getAccounts()) {
							var network = userSv.getAccounts()[y].Socialnet.network;
							if (networks.indexOf(network) == -1) {
								networks.push(network);
							}
						}
						$scope.config.custom.filters[x]['networks'] = networks;
					}
				}
			}

		}
	},true);

	$scope.$watch("userSv.getThemeConfig().custom.filters",function(config){
		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.list = [];
			$scope.offset = 0;
			$scope.pages = [];
			for (var x in $scope.config.custom.filters) {
				$scope.pages.push(x);
			}
			$scope.setList();
		}

	},true);	

	$scope.$watch("userSv.getThemeConfig().custom.colors",function(colors){
		if (angular.isDefined(colors)) {
			$scope.config.custom.colors = colors;
			$scope.setBackgroundColor();
		}		
	},true);

	$scope.$watch("userSv.getAccounts()",function(accounts){
		$scope.accounts = accounts;
		
		if (accounts.length) {
			$scope.accountsLoaded = true;			
		}

		if ($scope.configLoaded) {

			for (var x in $scope.config.custom.filters) {

				if (!angular.isDefined($scope.config.custom.filters[x]['networks'])) {
					var networks = [];
					for (var y in userSv.getAccounts()) {
						var network = userSv.getAccounts()[y].Socialnet.network;
						if (networks.indexOf(network) == -1) {
							networks.push(network);
						}
					}
					$scope.config.custom.filters[x]['networks'] = networks;
				}
			}
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.setList();
		}
	},true);

	$scope.$watch("current",function(current){
		$scope.setList();
	});

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
        $scope.getStyle();
    });

    $scope.adminTheme = function() {
    	$scope.showConfig = !$scope.showConfig;
    };

    $scope.getConfigStyle = function() {
	   	if ($scope.showConfig == true) {
	   		return {'left':'0'};
    	}
	   	return {'left':'-300px'};
    };

    $scope.getConfigButtonStyle = function() {
	   	if ($scope.showConfig == true) {
	   		return {'left':'300px'};
    	}
	   	return {'left':'300px'};
    };

}