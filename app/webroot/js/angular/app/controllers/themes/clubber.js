function themeClubberCo($scope,appSv,userSv,contentSv,$sce) {

	$scope.contentSv= contentSv;
	$scope.userSv	= userSv;
	$scope.user 	= userSv.getUser();

	$scope.networks = appSv.getNetworks();
	$scope.networks.tumblr.concepts = ['video','track'];
	$scope.networks.facebook.concepts = ['photo','video'];

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	$scope.config		= {};
	$scope.configLoaded = false;
    $scope.showConfig 	= false;
	$scope.tabs = [
		{ title:"Colors", key:"colors", active: true },
		{ title:"Fonts", key:"fonts" },
		{ title:"Width", key:"width" },
	];
	$scope.activeAdminTab = 'colors';

	$scope.current	= 'home';
	$scope.pages 	= [];
	$scope.content 	= {};
	$scope.limit 	= 10;

	userSv.loadThemeConfig('clubber');
	userSv.loadAccounts();

	$scope.isLogged = function() {
		return userSv.isLogged();
	}

	$scope.getContent = function(type) {

		var params			= [];
		params['concepts']	= JSON.parse(JSON.stringify($scope.config.custom.filters[type].concepts));
		params['networks']	= JSON.parse(JSON.stringify($scope.config.custom.filters[type].networks));
		params['offset']	= $scope.content[type].offset;
		params['limit']		= $scope.limit;
		params['accounts']	= [];

		params['username']	= $scope.user.username;
		if (angular.isDefined($scope.user['id'])) {
			params['user_id']	= $scope.user.id;
		}

		for (var x in $scope.accounts) {
			var account = $scope.accounts[x].Socialnet;
			if ($scope.config.custom.filters[type].networks.indexOf(account.network) != -1 &&
				params['accounts'].indexOf(account.id) == -1) {
				params['accounts'].push(account.id);
			}
		}

		contentSv.getContentsByFilters(params).then(
			function(data) {
				var contents = data.contents;
				if (data.contents.length) {
					for (var x in contents) {
						content = contents[x].Content;
						$scope.content[type].list.push(content);
					}
					$scope.content[type].offset = $scope.content[type].list.length;
					contentSv.setPageList(type,$scope.content[type]);
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

	$scope.init = function() {

		$scope.pages = [];
		for (var x in $scope.config.custom.filters) {
			$scope.pages.push(x);

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


			if (!angular.isDefined($scope.content[x])) {
				$scope.content[x] = {'offset':0,'list':[]};
				$scope.getContent(x);
			}
		}
	}

	$scope.hasContent = function(page) {

		if (!angular.isDefined($scope.content[page])) {
			return false;
		}

		return $scope.content[page].list.length != 0;
	}

	$scope.checkHasContent = function() {
		for (var x in $scope.pages) {
			$scope.hasContent(x);
		}
	}

	$scope.isActive = function(page) {
		return page == $scope.current;
	}	

	$scope.getMenuItemClass = function(page) {
		return ($scope.isActive(page)) ? 'active':'';
	}

	$scope.getMenuItemStyle =  function(page) {
		var style = {};
		if ($scope.isActive(page)) {
			style['background-color']	= $scope.config.custom.colors.contentBackground.value;
			style['color']				= $scope.config.custom.colors.contentText.value;
		}

		return style;
	}

	$scope.setCurrent = function(page) {

		if ($scope.isActive(page)) {
			return;
		}

		$scope.current = page;
	}

	$scope.getHomepageSize = function(page) {

		if (page == 'photos') {
			return 'xlarge';
		}

		return 'medium';
	}	

	$scope.getPageClass = function(page) {

		if (page == $scope.current) {
			return 'activePage';
		}
		return 'inactivePage';
	}

	$scope.$watch("userSv.getAccounts()",function(accounts){

		if (accounts.length > 0) {
			$scope.accounts = accounts;
			$scope.accountsLoaded = true;
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.init();
		}
	},true);

	$scope.$watch("userSv.getThemeConfig()",function(configNew,configOld){
		if (!angular.equals(configNew, configOld)) {
			$scope.config = configNew;
			$scope.configLoaded = true;
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.init();
		}
	});

	$scope.$watch("userSv.getThemeConfig().custom.colors",function(colors){
		if (angular.isDefined(colors)) {
			$scope.config.custom.colors = colors;
			$scope.setColor();
			$scope.getHighlightStyle();
			$scope.getDividerStyle();
		}		
	},true);

	$scope.$watch("userSv.getThemeConfig().custom.fonts",function(fonts){
		if (angular.isDefined(fonts)) {
			$scope.config.custom.fonts = fonts;
			$scope.setFont();
		}		
	},true);

	$scope.$watch("userSv.getThemeConfig().custom.width",function(width){
		if (angular.isDefined(width)) {
			$scope.config.custom.width = width;
			$scope.getAppStyle();
		}
	},true);

	$scope.$watch("content",function(content){
		if (!angular.equals(content, {})) {
			$scope.checkHasContent();
		}
	},true);	

	/*
	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
        //$scope.getStyle();
    });
	*/

	$scope.networkIcon = function(network) {
		return "http://cloudcial.com/img/socialnet/icons/ce_"+network+".png";
	}

	$scope.statIcon = function(stat_name) {
		return contentSv.getStatIcon(stat_name);
	}

	$scope.conceptIcon = function(concept) {
		return contentSv.getConceptIcon(concept);
	}

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

	$scope.setColor = function() {

		var element = angular.element(document.querySelector('body'));
		$(element[0]).css('color',$scope.config.custom.colors.contentText.value);
		var element = angular.element(document.querySelector('.navbar-brand'));
		$(element[0]).css('color',$scope.config.custom.colors.contentText.value);

		var rgb = contentSv.hexToRgb($scope.config.custom.colors.background.value);
		var rgbString = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.6)";
		var element = angular.element(document.querySelector('#container'));
		$(element[0]).css('background-color',$scope.config.custom.colors.background.value);
		$(element[0]).css('background-color',rgbString);

		var element = angular.element(document.querySelector('.navbar'));
		$(element[0]).css('background-color',$scope.config.custom.colors.background.value);
		$(element[0]).css('background-color',rgbString);

		var element = angular.element(document.querySelector('.navbar-nav li.active a'));
		$(element[0]).css('background-color',$scope.config.custom.colors.contentBackground.value);

	}

	$scope.setFont = function() {

		var element = angular.element(document.querySelector('body'));
		$(element[0]).css('font-family',$scope.config.custom.fonts.selected.family);
		$(element[0]).css('font-size',$scope.config.custom.fonts.selected.size);
	}

    $scope.getFooterStyle = function() {

    	if (angular.equals({},$scope.config)) {
    		return {};
    	}

    	var width = "100%";
    	if (!angular.equals({},$scope.config)) {
    		width = $scope.config.custom.width;
    	}

		var rgb = contentSv.hexToRgb($scope.config.custom.colors.background.value);
		var rgbString = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.6)";

    	var style = {
    		'width':width,
    		'background-color':rgbString,
    		'color':$scope.config.custom.colors.contentText.value
    	};

	   	return style;
    }

	$scope.getDividerStyle = function() {

		if (!angular.isDefined($scope.config.custom)) {
			return {};
		}

		return {
			'border-color' : $scope.config.custom.colors.contentBackground.value
		};		
	}

	$scope.getHighlightStyle = function() {

		if (!angular.isDefined($scope.config.custom)) {
			return {};
		}

		return {
			'color' : $scope.config.custom.colors.contentBackground.value
		};
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
}
