function themeSimpleCo($scope,appSv,userSv,contentSv,$sce) {

	$scope.contentSv= contentSv;
	$scope.userSv	= userSv;
	$scope.user 	= userSv.getUser();

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	$scope.limit 	= 10;
	$scope.offset	= 0;
	$scope.list 	= [];
	$scope.filters	= {'concepts':[],'networks':[]};
	$scope.networks = [];
	$scope.concepts = [];
	$scope.current	= 0;
	$scope.controlHover = false;

	$scope.config		= {};
	$scope.configLoaded = false;
    $scope.showConfig = false;
	$scope.tabs = [
		{ title:"Colors", key:"colors" },
		{ title:"Fonts", key:"fonts" },
		{ title:"Width", key:"width" },
	];
	$scope.activeAdminTab = 'colors';

	$scope.showFooter = false;

	userSv.loadThemeConfig('simple');
	userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});

	$scope.isLogged = function() {
		return userSv.isLogged();
	}	

	$scope.initFilters = function() {

		var filters	= {'concepts':[],'networks':[]};
		var networks= appSv.getNetworks();

		for (var x in $scope.accounts) {
			var account = $scope.accounts[x]['Socialnet'];
			if (filters['networks'].indexOf(account.network) == -1){
				filters['networks'].push(account.network);
			}

			var concepts =  angular.isDefined(networks[account.network]) ? networks[account.network]['concepts'] : [];

			for (var y in concepts){
				var concept = concepts[y];
				if (filters['concepts'].indexOf(concept) == -1){
					filters['concepts'].push(concept);
				}
			}
		}

		if (!angular.equals($scope.filters, filters)) {
			$scope.filters = filters;
		}

		$scope.networks = filters.networks;
		$scope.concepts = filters.concepts;
		
	}

	$scope.generateFilters = function() {

		var newConcepts = [];
		var networks= appSv.getNetworks();

		for (var x in $scope.networks) {
			var network = $scope.networks[x];
			var concepts = networks[network]['concepts'];
			for (var y in concepts){
				var concept = concepts[y];
				if (newConcepts.indexOf(concept) == -1){
					newConcepts.push(concept);
				}
			}
		}

		$scope.concepts = newConcepts;
	}

	$scope.moreContent = function() {
		if (!contentSv.isLoading()) {
			$scope.setList();
		}
	}	


	$scope.setList = function() {

		if (!contentSv.isLoading() && $scope.configLoaded) {

			if ($scope.concepts.length == 0) {
				$scope.list = [];
				return;
			}

			var params			= [];
			params['concepts']	= JSON.parse(JSON.stringify($scope.concepts));
			params['offset']	= $scope.offset;
			params['limit']		= $scope.limit;
			params['accounts']	= [];

			params['username']	= $scope.user.username;
			if (angular.isDefined($scope.user['id'])) {
				params['user_id']	= $scope.user.id;
			}

			for (var x in $scope.accounts) {
				var account = $scope.accounts[x].Socialnet;
				if ($scope.networks.indexOf(account.network) != -1) {
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


	$scope.$watch("userSv.getAccounts()",function(accounts){

		if (accounts.length > 0) {
			$scope.accounts = accounts;
			$scope.accountsLoaded = true;
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.initFilters();
			$scope.setList();
		}
	},true);

	$scope.$watch("userSv.getThemeConfig()",function(configNew,configOld){
		if (!angular.equals(configNew, configOld)) {
			$scope.config = configNew;
			$scope.configLoaded = true;
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.initFilters();
		}
	});

	$scope.$watch("userSv.getThemeConfig().custom.colors",function(colors){
		if (angular.isDefined(colors)) {
			$scope.config.custom.colors = colors;
			$scope.setColor();
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

	$scope.$watch("contentSv.getQueue()",function(queue){
		if (queue.length>0) {
			$scope.showFooter = true;
		}
	},true);	

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
        $scope.getStyle();
    });

	$scope.$watchCollection("[showFooter]",function(values){
		$scope.getFooterStyle();
	});

	$scope.$watchCollection("[controlHover,current]",function(values){
		$scope.getNavigatorThumbnail(-1);
		$scope.getNavigatorTitle(-1);
		$scope.getNavigatorNetwork(-1);
		$scope.getNavigatorThumbnail(1);
		$scope.getNavigatorTitle(1);
		$scope.getNavigatorNetwork(1);
		$scope.getContentStyle();
		$scope.hideOnHover();
	});

	$scope.move = function(direction) {

		if (direction > 0) {
			$scope.current++;
		} else {
			$scope.current--;		
		}

		if ($scope.current == $scope.list.length) {
			$scope.current = 0;
		}
		if ($scope.current < 0) {		
			$scope.current = $scope.list.length - 1;
		}

		if ( $scope.list.length - 1 - $scope.current < 5 ) {
			$scope.moreContent();
		}
	}

    $scope.getContentCommentsHash = function() {
    	var c = $scope.list[$scope.current];
    	return "http://cloudcial.com/comments/"+c.network + '_' + c.external_user_id + '_' + c.concept + '_' + c.external_id;
    }	

	$scope.networkIcon = function(network) {
		return "http://cloudcial.com/img/socialnet/icons/ce_"+network+".png";
	}

	$scope.statIcon = function(stat_name) {
		return contentSv.getStatIcon(stat_name);
	}

	$scope.conceptIcon = function(concept) {
		return contentSv.getConceptIcon(concept);
	}

	$scope.filterNetworkStyle = function(network) {

		var style = {'opacity':1};

		if ($scope.networks.indexOf(network) == -1) {
			style['opacity'] = '0.3';
		}

		return style;
	}

	$scope.filterConceptStyle = function(concept) {

		var style = {'opacity':1};

		if ($scope.concepts.indexOf(concept) == -1) {
			style['opacity'] = '0.3';
		}

		return style;
	}

	$scope.filterNetwork = function(network) {

		var index = $scope.networks.indexOf(network);
		if (index != -1) {
			var networks = [];
			for (var x in $scope.networks) {
				var network = $scope.networks[x];
				if (x != index) {
					networks.push(network);
				}
			}
			$scope.networks = networks;
		} else {
			$scope.networks.push(network);
		}
		$scope.generateFilters();
		$scope.offset	= 0;
		$scope.list 	= [];
		$scope.setList();
	}

	$scope.filterConcept = function(concept) {

		var index = $scope.concepts.indexOf(concept);
		if (index != -1) {
			var concepts = [];
			for (var x in $scope.concepts) {
				var concept = $scope.concepts[x];
				if (x != index) {
					concepts.push(concept);
				}
			}
			$scope.concepts = concepts;
		} else {
			$scope.concepts.push(concept);
		}
		$scope.offset	= 0;
		$scope.list 	= [];
		$scope.setList();
	}

	$scope.getStyle = function() {
		appSv.setMyWH(appSv.getHeight() - $scope.menuHeight);
		return {'min-height':appSv.getHeight() - $scope.menuHeight + 'px'};
	}

	$scope.getQueueStyle = function() {
		return {'width':appSv.getWidth() + 'px'};
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

	$scope.getProfileImg = function(index) {
		var external_user_id = $scope.list[index].external_user_id;
		for (var x in $scope.accounts) {
			var account = $scope.accounts[x].Socialnet;
			if (account.external_user_id == external_user_id && 
				account.network == $scope.list[index].network ) {
				return account.profile_image;
			}
		}
		return '';
	}

	$scope.hideOnHover = function() {

		if ($scope.controlHover) {
			return {'display':'none'}
		}
		return {'display':'block'}
	}

    $scope.adminTheme = function() {
    	$scope.showConfig = !$scope.showConfig;
    };

    $scope.footer = function() {
    	$scope.showFooter = !$scope.showFooter;
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
		$(element[0]).css('background-color',$scope.config.custom.colors.background.value);

		var element = angular.element(document.querySelector('#list'));
		$(element[0]).css('background-color',$scope.config.custom.colors.background.value);

		var element = angular.element(document.querySelector('.control'));
		$(element[0]).css('background-color',$scope.config.custom.colors.background.value);
	}

	$scope.setFont = function() {

		var element = angular.element(document.querySelector('body'));
		$(element[0]).css('font-family',$scope.config.custom.fonts.selected.family);
		$(element[0]).css('font-size',$scope.config.custom.fonts.selected.size);
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

    $scope.getFooterStyle = function() {

    	var width = "100%";
    	if (!angular.equals({},$scope.config)) {
    		width = $scope.config.custom.width;
    	}

    	var style = {'width':width};
	   	if ($scope.showFooter == true) {
	   		style['top'] =  appSv.getHeight() - $scope.footerHeight + 'px';
	   		return style;	   		
    	}
    	style['top'] = '100%';
	   	return style;
    }

    $scope.getFooterButtonStyle = function() {
	   	if ($scope.showFooter == true) {
	   		return {'bottom':'100%'};
    	}
	   	return {'bottom':'0'};
    };	    

    $scope.getMenuStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

		return {
			'background-color':$scope.config.custom.colors.contentBackground.value,
			'color':$scope.config.custom.colors.contentText.value,
		};
    }

    $scope.getContentStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

    	var style = {
			//'background-color':$scope.config.custom.colors.contentBackground.value,
			'color':$scope.config.custom.colors.contentText.value,
			'min-height':appSv.getHeight() - $scope.menuHeight + 'px'
    	}

    	if ($scope.controlHover) {

    		if ($scope.config.custom.width != "100%") {
	    		style['width']	= '60%';
	    		style['left']	= '20%';
    		} else {
	    		style['width']	= '50%';
	    		style['left']	= '25%';
    		}


    	} else {

    		if ($scope.config.custom.width != "100%") {
	    		style['width']	= '90%';
	    		style['left']	= '5%';
    		} else {
    			
    		}

    	}

    	return style;

    }

    $scope.getControlStyle = function(direction) {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

		var style = {};

		if ($scope.getNavigatorThumbnail(direction).length>0) {			
			style['background']			= 'url('+$scope.getNavigatorThumbnail(direction)+')';
			style['background-size']	= 'cover';
			style['background-position']= 'center center';
		}

		//style['background-color'] = $scope.config.custom.colors.contentBackground.value;
		style['color'] = $scope.config.custom.colors.contentText.value;

		return style;
    }

    $scope.getContentClass = function(index) {

    	if ($scope.current != index) {
    		return '';
    	}
    	var current = $scope.list[$scope.current];
    	return 'content_hover '+current.network+'_color';
    }

    $scope.getNavigatorIndex = function(direction) {

		var current = $scope.current;

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

		return current;
    }

	$scope.getNavigatorClass = function(direction) {

		var current = $scope.current;

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

		if (!angular.isDefined($scope.list[current])) {
			return '';
		}
		var content = $scope.list[current];
		return content.network+"_bg "+content.network+"_color";
	}

	$scope.getNavigatorTitle = function(direction) {

		var current = $scope.current;

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

		if (!angular.isDefined($scope.list[current])) {
			return '';
		}
		var content = $scope.list[current];
		return content.network+" "+content.external_user_name+" "+content.concept;
	}

	$scope.getNavigatorNetwork = function(direction) {

		var current = $scope.current;

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

		if (!angular.isDefined($scope.list[current])) {
			return '';
		}
		var content = $scope.list[current];
		return content.network;
	}

	$scope.getNavigatorThumbnail = function(direction) {

		var current = $scope.current;

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

		if (!angular.isDefined($scope.list[current])) {
			return '';
		}

		var content = $scope.list[current];

		if (angular.isDefined(content)) {
			return contentSv.getThumbnail(content);
		}

		return '';
	}
	$scope.getNavigatorConceptIcon = function(direction) {

		var current = $scope.current;

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

		if (!angular.isDefined($scope.list[current])) {
			return '';
		}

		var content = $scope.list[current];

		if (angular.isDefined(content)) {
			return contentSv.getConceptIcon(content.concept);
		}

		return '';
	}

	$scope.hasPlayer = function(index) {

		var content = contentSv.getQueue()[index];
		if (!angular.isDefined(content)) {
			return false;
		}
		return true;
	}

	$scope.getPlayer = function(index) {

		var content = contentSv.getQueue()[index];
		if (!angular.isDefined(content)) {
			return $sce.trustAsHtml("");
		}
		return $sce.trustAsHtml(contentSv.cleanSource(contentSv.getPlayer(content)));
	}
}
