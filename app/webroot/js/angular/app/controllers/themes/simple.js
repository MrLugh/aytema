function themeSimpleCo($scope,appSv,userSv,contentSv,$sce) {

	$scope.contentSv= contentSv;
	$scope.userSv	= userSv;
	$scope.user 	= userSv.getUser();

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	$scope.limit 	= 1;
	$scope.offset	= 0;
	$scope.list 	= [];
	$scope.filters	= {'concepts':[],'networks':[]};
	$scope.networks = [];
	$scope.concepts = [];
	$scope.current	= -1;
	$scope.search	= '';
	$scope.noMore 	= false;

	$scope.config		= {};
	$scope.configLoaded = false;
    $scope.showConfig = false;
	$scope.tabs = [
		{ title:"Colors", key:"colors", active: true },
		{ title:"background Image", key:"background" },
		{ title:"Fonts", key:"fonts" },
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

		//if (!contentSv.isLoading() && $scope.configLoaded) {
		if ($scope.configLoaded) {

			if ($scope.concepts.length == 0) {
				$scope.list = [];
				return;
			}

			var params			= [];
			params['concepts']	= JSON.parse(JSON.stringify($scope.concepts));
			params['offset']	= $scope.offset;
			params['limit']		= $scope.limit;
			params['accounts']	= [];
			params['status']	= 'enabled';
			params['search']	= $scope.search;

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

						if ($scope.list.length > 1) {
							$('html, body').animate({
								scrollTop: $(document).height() - 40
							}, 2000);
						}

						$scope.noMore = false;

					} else {
						$scope.noMore = true;
						if ($scope.list.length > 1) {
							$('html, body').animate({
								scrollTop: 0
							}, 500);
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
			$scope.setList();			
		}
	});

	$scope.$watch("search",function(){
		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.offset	= 0;
			$scope.list 	= [];
			$scope.setList();
		}
	},true);

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

	$scope.$watch("userSv.getThemeConfig().custom.background",function(background){
		if (angular.isDefined(background)) {
			$scope.config.custom.background = background;
			$scope.setBackground();
		}		
	},true);

	$scope.$watch("contentSv.getQueue()",function(queue){

		if (!queue.length) {
			$scope.showFooter = false;
		}

	},true);

	$scope.$on('addToQueue',function(){
		$scope.$apply(function(){
			$scope.showFooter = true;

			setTimeout(function(){
				$('html, body').animate({
					scrollTop: $(document).height() - 40
				}, 500);
			},750);
		});
	});

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
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

    $scope.footer = function() {
    	$scope.showFooter = !$scope.showFooter;
    	if (!$scope.showFooter) {
			setTimeout(function(){
				$('html, body').animate({
					scrollTop: $(document).height() - 40
				}, 500);
			},750);
    	}
    };

	$scope.networkIcon = function(network) {

		var icon_class = "";

        if (network == "cloudcial") {
            icon_class = "icon-cloud";
        } else if (network == "facebook") {
            icon_class = "fa fa-facebook";
        } else if (network == "twitter") {
            icon_class = "icon-twitter";
        } else if (network == "youtube") {
            icon_class = "fa fa-youtube";            
        } else if (network == "vimeo") {
            icon_class = "icon-vimeo";
        } else if (network == "tumblr") {
            icon_class = "icon-tumblr";
        } else if (network == "mixcloud") {
            icon_class = "icon-renren";
        } else if (network == "soundcloud") {
            icon_class = "icon-soundcloud";
        }
		return icon_class;
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

    $scope.adminTheme = function() {
    	$scope.showConfig = !$scope.showConfig;
    };

	$scope.getCollapseMenuItemStyle = function() {

    	if (angular.equals({},$scope.config)) {
    		return {};
    	}

		var color = $scope.config.custom.colors.contentBackground.value.replace("#","");
		if (contentSv.getContrast50(color) == 'white') {
			color = '#ffffff';
		} else {
			color = '#000000'
		}

		return {
			'background-color': color
		}
	}

	$scope.customStyle = function() {
		return $sce.trustAsHtml("<style>a,a:hover {color:"+$scope.config.custom.colors.title.value+"!important;} .title,.title:hover {color:"+$scope.config.custom.colors.title.value+"!important;}</style>");
	}

	$scope.setColor = function() {

		var element = angular.element(document.querySelector('body'));
		$(element[0]).css('background-color',$scope.config.custom.colors.background.value);
		$(element[0]).css('color',$scope.config.custom.colors.contentText.value);

		var element = angular.element(document.querySelector('#list'));
		//$(element[0]).css('background-color',$scope.config.custom.colors.background.value);

		var element = angular.element(document.querySelector('.control'));
		$(element[0]).css('background-color',$scope.config.custom.colors.background.value);

		var element = angular.element(document.querySelector('#search'));
		$(element[0]).css('color',$scope.config.custom.colors.contentText.value);
	}

	$scope.setFont = function() {

		var element = angular.element(document.querySelector('body'));
		$(element[0]).css('font-family',$scope.config.custom.fonts.selected.family);
		$(element[0]).css('font-size',$scope.config.custom.fonts.selected.size);
	}

	$scope.setBackground = function() {

		var element = angular.element(document.querySelector('body'));

		if (!$scope.config.custom.background.selected.length) {
			$(element[0]).css('background-image','');
			return;
		}

        var img = new Image();

        img.onload = function() {

			$(element[0]).css('background-image','url("'+$scope.config.custom.background.selected+'")');

        	var w = img.naturalWidth;
        	var h = img.naturalHeight;

        	if (w < 300 || h < 300) {
        		$(element[0]).css('background-size','initial');
        		$(element[0]).css('background-attachment','initial');
        		return;
        	}

    		$(element[0]).css('background-size','cover');
    		$(element[0]).css('background-attachment','fixed');
        }

        img.src = $scope.config.custom.background.selected;
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

	$scope.getStyle = function() {
		return {'margin-top':$scope.getMenuHeight() + 'px'};
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

    	var style = {};

    	if (!angular.equals({},$scope.config)) {
    		style['background-color'] = $scope.config.custom.colors.contentBackground.value;
    	}

	   	if ($scope.showFooter == true) {
	   		style['top'] =  $scope.getMenuHeight() + 20 + 'px';
	   		return style;	   		
    	}
    	style['top'] = '100%';
	   	return style;
    }

    $scope.getFooterButtonStyle = function() {
    	var style = {};

    	/*
	   	if ($scope.showFooter == true) {
	   		style['bottom'] = '100%';
    	} else {
    		style['bottom'] = '0';
    	}
    	*/

    	if (!angular.isDefined($scope.config.custom)) {
    		return style;
    	}

	   	return style;
    };	    

    $scope.getMenuStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

		return {
			'background-color':$scope.config.custom.colors.contentBackground.value,
		};
    };

    $scope.getContentStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

		return {
			'background-color':$scope.config.custom.colors.contentBackground.value,
		};
    };

	$scope.getPlayer = function(index) {

		var content = contentSv.getQueue()[index];
		if (!angular.isDefined(content)) {
			return $sce.trustAsHtml("");
		}
		return $sce.trustAsHtml(contentSv.getPlayer(content));
	};


}
