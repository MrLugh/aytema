function themeDigestCo($scope,appSv,userSv,contentSv) {

	$scope.contentSv = contentSv;
	$scope.user = userSv.getUser();

	$scope.userMessage	= '';

	$scope.showOverlay = false;
	$scope.indexOverlay = -1;

	$scope.masonry = {};
	$scope.masonryLoading = false;

	$scope.list 	= [];
	$scope.offset 	= 0;
	$scope.limit	= 10;

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	$scope.config	= {};
	$scope.configLoaded = false;

	$scope.current	= 'home';
	$scope.pages 	= [];

	userSv.loadThemeConfig($scope.user.theme);
	userSv.loadAccounts();

    $scope.showConfig = false;

	$scope.showingContent	= false;
	$scope.contentModal		= [];
	$scope.currentContent	= false;
	$scope.relateds			= [];

	$scope.contentShadow = false;

	$scope.tabs = [
		{ title:"Pages Filters",key:"pagefilter", active: true },
		{ title:"Content Sizes", key:"contentsize" },
		{ title:"Colors", key:"colors" },
		{ title:"Fonts", key:"fonts" },
		{ title:"Width", key:"width" },
	];
	$scope.activeAdminTab = 'pagefilter';

	$scope.getListLength = function() {
		return $scope.list.length;
	}

	$scope.getFilters = function() {

		var filters	= {'concepts':[],'networks':[]};

		var accounts= $scope.accounts;

		if (!accounts.length && !userSv.isLoading()) {
			userSv.loadAccounts();
			return filters;
		}

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

	$scope.showMessage = function(message) {
		$scope.userMessage = message;
	}

	$scope.clearList = function() {
		$scope.showMessage('Deleting...');
		$scope.list = [];
	}

	$scope.setList = function() {

		if (!contentSv.isLoading() && $scope.configLoaded) {
			var filters = $scope.getFilters();
			if (!filters.concepts.length && !filters.networks.length) {
				$scope.list = [];
				return;
			}

			$scope.showMessage('Getting content...');

			var params			= [];
			params['concepts']	= JSON.parse(JSON.stringify(filters.concepts));
			params['offset']	= $scope.offset;
			params['limit']		= $scope.limit;
			params['accounts'] = [];

			for (var x in $scope.accounts) {
				var account = $scope.accounts[x].Socialnet;
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

					} else {
						$scope.showMessage('There is no content :(');
					}
				},
				function(reason) {
					//console.log('Failed: ', reason);
				},
				function(update) {
					//console.log('Got notification: ', update);
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
		if (!contentSv.isLoading() && !$scope.masonryLoading) {
			$scope.setList();
		}
	}

	$scope.getStyle = function() {
		appSv.setMyWH(appSv.getHeight() - $scope.menuHeight);
		return {'min-height':appSv.getHeight() - $scope.menuHeight + 'px'};
	}

	$scope.getMasonryStyle = function() {
		var style = $scope.getStyle();
		style['opacity'] = 1;
		if ($scope.showingContent) {
			style['opacity'] = 0;
		}
		return style;
	}

	$scope.getMenuItemClass = function(page) {
		return ($scope.current == page) ? 'active':'';
	}

	$scope.getAccountLink = function(index,external_user_id) {
		for (var x in $scope.accounts) {
			var account = $scope.accounts[x].Socialnet;
			if (account.external_user_id == external_user_id && 
				account.network == $scope.list[index].network ) {
				return account.profile_url;
			}
		}
		return '';
	}

	$scope.getProfileImg = function() {
		var external_user_id = $scope.list[$scope.currentContent].external_user_id;
		for (var x in $scope.accounts) {
			var account = $scope.accounts[x].Socialnet;
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
				//console.log('Failed: ', reason);
			},
			function(update) {
				//console.log('Got notification: ', update);
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
				$scope.list[index].status = "disabled";
			}
		});

	}

	$scope.activate = function(index) {

		contentSv.activateContent($scope.list[index].id).
		then(function(data){
			if (data.message == "Activated") {
				$scope.list[index].status = "enabled";
			}
		});
	}	

	$scope.manageContent = function(index) {

		if ($scope.list[index].status == "enabled") {
			$scope.delete(index);
			return;
		}

		$scope.activate(index);
	}

	$scope.getManageContentIconClass = function(index) {
		if ($scope.list[index].status == "enabled") {
			return 'icon-lock';
		}

		return 'icon-unlock';
	}
	

	$scope.getModalBackgroundStyle = function() {
		return {'background-color':$scope.config.custom.colors.background.value};
	}

	$scope.contentStyle = function() {
		return {
			'background-color':$scope.config.custom.colors.contentBackground.value,
			'color':$scope.config.custom.colors.contentText.value,
		};		
	}

	$scope.getContentStyle = function(content) {

		var style = $scope.contentStyle();

		if ($scope.showOverlay == true) {
			if ($scope.indexOverlay == $scope.list.indexOf(content)) {
				style['opacity'] = '1';
				return style;
			}
			style['opacity'] = '0.3';
			return style;
		}

		if (angular.isDefined(content) && !contentSv.isContentEnabled(content)) {
			style['opacity'] = '0.3';
			return style;
		}
		style['opacity'] = '1';
		return style;
	}

	$scope.setBackgroundColor = function() {

		var element = angular.element(document.querySelector('body'));
		$(element[0]).css('background-color',$scope.config.custom.colors.background.value);

		var element = angular.element(document.querySelector('.overlay_content'));
		$(element[0]).css('background-color',$scope.config.custom.colors.background.value);		
	}

	$scope.setFont = function() {

		var element = angular.element(document.querySelector('body'));
		$(element[0]).css('font-family',$scope.config.custom.fonts.selected.family);
		$(element[0]).css('font-size',$scope.config.custom.fonts.selected.size);
	}	

	$scope.enableMasonry = function() {
		$scope.masonryLoading = false;
	}

	$scope.initFilters = function() {

		$scope.offset = 0;
		$scope.pages = [];
		for (var x in $scope.config.custom.filters) {
			$scope.pages.push(x);
		}

		for (var x in $scope.config.custom.filters) {

			if (!angular.isDefined($scope.config.custom.filters[x]['networks'])) {
				var networks = [];
				for (var y in $scope.accounts) {
					var network = $scope.accounts[y].Socialnet.network;
					if (networks.indexOf(network) == -1) {
						networks.push(network);
					}
				}
				$scope.config.custom.filters[x]['networks'] = networks;
			}
		}

	}

	$scope.userSv = userSv;
	$scope.$watch("userSv.getThemeConfig()",function(configNew,configOld){
		if (!angular.equals(configNew, configOld)) {
			$scope.config = configNew;
			$scope.configLoaded = true;
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.initFilters();
		}
	});

	$scope.$watch("userSv.getThemeConfig().custom.filters",function(filters){
		if (angular.isDefined(filters)) {
			$scope.config.custom.filters = filters;
		}
		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.initFilters();
			$scope.reinitMasonry();	
		}
	},true);

	$scope.$watch("userSv.getThemeConfig().custom.colors",function(colors){
		if (angular.isDefined(colors)) {
			$scope.config.custom.colors = colors;
			$scope.setBackgroundColor();
		}		
	},true);

	$scope.$watch("userSv.getThemeConfig().custom.fonts",function(fonts){
		if (angular.isDefined(fonts)) {
			$scope.config.custom.fonts = fonts;
			$scope.setFont();
		}		
	},true);	

	$scope.$watch("userSv.getThemeConfig().custom.contentsizes",function(sizes){
		if (angular.isDefined(sizes)) {
			$scope.config.custom.contentsizes = sizes;
			$scope.offset 	= 0;
			$scope.reinitMasonry();	
		}
	},true);

	$scope.$watch("userSv.getThemeConfig().custom.width",function(width){
		if (angular.isDefined(width)) {
			$scope.config.custom.width = width;
			$scope.getAppStyle();
		}		
	},true);

	$scope.$watch("userSv.getAccounts()",function(accounts){
		if (accounts.length > 0) {
			$scope.accounts = accounts;
			$scope.accountsLoaded = true;
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.initFilters();
			$scope.reinitMasonry();	
		}
	},true);

	$scope.$watch("current",function(current,oldCurrent){
		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.current = current;
			$scope.reinitMasonry();
		}
	});

	$scope.$watchCollection("[userMessage,showUp]",function(values){
		$scope.getFooterStyle();
	});

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
        $scope.getMasonryStyle();
        $scope.getStyle();
    });

    $scope.adminTheme = function() {
    	$scope.showConfig = !$scope.showConfig;
    };

    $scope.getAppStyle = function() {
    	var width = "100%";
    	if (!angular.equals({},$scope.config)) {
    		width = $scope.config.custom.width;
    	}

    	return {'width':width};
    }

    $scope.getAppClass = function() {

    	if (angular.equals({},$scope.config)) {
    		return '';
    	}

    	if ($scope.config.custom.width != "100%") {
    		return 'boxed';
    	}
    	return '';
    }

    $scope.getFooterStyle = function() {

    	var width = "100%";
    	if (!angular.equals({},$scope.config)) {
    		width = $scope.config.custom.width;
    	}

    	var style = {'width':width};
	   	if ($scope.userMessage.length > 0 || $scope.showUp == true) {
	   		style['top'] =  appSv.getHeight() - $scope.footerHeight + 'px';
	   		style['z-index'] = '2';
	   		style['opacity'] = '1';
	   		return style;	   		
    	}
    	style['top'] = '100%';
   		style['z-index'] = '1';
   		style['opacity'] = '0';
	   	return style;
    }

    $scope.getConfigStyle = function() {
	   	if ($scope.showConfig == true) {
	   		return {'left':'0'};
    	}
	   	return {'left':'0'};
    };

    $scope.getConfigButtonStyle = function() {
	   	if ($scope.showConfig == true) {
	   		return {'left':'100%'};
    	}
	   	return {'left':'0'};
    };

    $scope.getContentCommentsHash = function() {
    	var c = $scope.contentModal[0];
    	return "http://aytema.com/comments/"+c.network + '_' + c.external_user_id + '_' + c.concept + '_' + c.external_id;
    }

    $scope.activateTab = function(tab) {
    	$scope.activeAdminTab = tab;
    }

    $scope.isActiveTab = function(tab) {
    	return $scope.activeAdminTab == tab;
    }

}