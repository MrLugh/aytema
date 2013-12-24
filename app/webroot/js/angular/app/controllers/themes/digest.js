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

	$scope.getListLength = function() {
		return $scope.list.length;
	}

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
		/*
		console.log("$scope.getStyle");
		console.log(appSv.getHeight());
		console.log($scope.menuHeight);
		console.log('min-height',appSv.getHeight() - $scope.menuHeight + 'px');
		*/
		appSv.setMyWH(appSv.getHeight() - $scope.menuHeight);
		return {'min-height':appSv.getHeight() - $scope.menuHeight + 'px'};
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

		/*
		if (!$scope.masonryLoading) {
			return;
		}
		*/

		$scope.offset 	= 0;
		$scope.current = page;
		$scope.showingContent 	= false;
	}

	$scope.movePage = function(direction) {

		/*
		if (!$scope.masonryLoading) {
			return;
		}
		*/

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
		console.log($scope.list[index]);
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

	$scope.userSv = userSv;
	$scope.$watch("userSv.getThemeConfig()",function(configNew,configOld){
		if (!angular.equals(configNew, configOld)) {

			$scope.config		= userSv.getThemeConfig();
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
	});

	$scope.$watch("userSv.getThemeConfig().custom.filters",function(filters){
		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.offset = 0;
			$scope.pages = [];
			for (var x in $scope.config.custom.filters) {
				$scope.pages.push(x);
			}
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

			//SAVE CONFIG!
			//userSv.setThemeConfigFonts($scope.config.custom.fonts);
			
			$scope.setFont();
		}		
	},true);	

	$scope.$watch("userSv.getThemeConfig().custom.contentsizes",function(sizes){
		if (angular.isDefined(sizes)) {
			$scope.offset 	= 0;
			$scope.reinitMasonry();	
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
			$scope.reinitMasonry();	
		}
	},true);

	$scope.$watch("current",function(current,oldCurrent){
		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.reinitMasonry();
		}
	});

	$scope.$watch("userMessage",function(current){
		$scope.getUserMessageStyle();	
	});

	/*
	$scope.$watch("showOverlay",function(showOverlay){
		console.log(showOverlay);
		for (var x in $scope.list) {
			$scope.getContentStyle($scope.list[x]);
		}
	});
	*/

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
        $scope.getStyle();
    });

    $scope.adminTheme = function() {
    	$scope.showConfig = !$scope.showConfig;
    };

    $scope.getUserMessageStyle = function() {
    	//var style = $scope.getMessagePosition();
    	//console.log(style);
    	var style = {'top':'75%','left':'75%'};
	   	if ($scope.userMessage.length > 0 ) {
	   		style['z-index'] = '2';
	   		style['opacity'] = '1';
	   		return style;	   		
    	}
   		style['z-index'] = '1';
   		style['opacity'] = '0';
	   	return style;
    }

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

    $scope.getContentCommentsHash = function() {
    	var c = $scope.contentModal[0];
    	return "http://aytema.com/comments/"+c.network + '_' + c.external_user_id + '_' + c.concept + '_' + c.external_id;
    }

}