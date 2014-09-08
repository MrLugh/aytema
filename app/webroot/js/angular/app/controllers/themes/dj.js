function themeDjCo($scope,appSv,userSv,contentSv,$sce) {

	$scope.appSv 	= appSv;
	$scope.contentSv= contentSv;
	$scope.userSv	= userSv;
	$scope.user 	= userSv.getUser();
	$scope.networks = appSv.getNetworks();

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	$scope.limit 	= 10;
	$scope.content 	= {};
	$scope.current	= 'page_profile';

	$scope.config		= {};
	$scope.configLoaded = false;
    $scope.showConfig = false;
	$scope.tabs = [
		{ title:"Colors", key:"colors", active: true },
		{ title:"Fonts", key:"fonts" },
		{ title:"Width", key:"width" },
	];

	userSv.loadThemeConfig('dj');
	userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});

	$scope.isLogged = function() {
		return userSv.isLogged();
	}

	$scope.generatePagesList = function() {

		$scope.content 	= {};

		var concepts = [];

		for (var y in $scope.accounts) {
			var account = $scope.accounts[y]['Socialnet'];
			for (var x in $scope.networks[account.network]['concepts']){
				concept = $scope.networks[account.network]['concepts'][x];
				if (concepts.indexOf(concept) == -1) {
					concepts.push(concept);
				}	
			}
		}
		$scope.concepts = concepts;

		$scope.pages 	= [];
		$scope.content  = {};
		for (var x in $scope.concepts) {

			var concept = $scope.concepts[x];

			$scope.pages.push(concept);

			if (!angular.isDefined($scope.content[concept])) {
				$scope.content[concept] = {'offset':0,'list':[],'current':0};
				$scope.getContent(concept);
			}
		}

	}

	$scope.getContent = function(concept) {

		var params = [];

		var networks = [];
		var accounts = [];
		angular.forEach($scope.accounts, function(account,key) {
			if (networks.indexOf(account.Socialnet.network) == -1) {
				networks.push(account.Socialnet.network);
			}
			if (accounts.indexOf(account.Socialnet.id) == -1) {
				accounts.push(account.Socialnet.id);
			}
		});

		params['concepts']	= [concept];
		params['networks']	= networks;
		params['offset']	= $scope.content[concept].offset;
		params['limit']		= $scope.limit;
		params['accounts']	= accounts;

		contentSv.getContentsByFilters(params).then(
			function(data) {
				var contents = data.contents;
				if (data.contents.length) {
					for (var x in contents) {
						content = contents[x].Content;
						$scope.content[concept].list.push(content);
					}
					$scope.content[concept].offset = $scope.content[concept].list.length;
					//contentSv.setPageList(concept,$scope.content[concept]);
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

	$scope.getPluralizedConcepts = function(concept) {
		return appSv.getPluralizedConcepts()[concept];
	}

	$scope.getPlayer = function(content) {

		return $sce.trustAsHtml(contentSv.cleanSource(contentSv.getPlayer(content)));
	}


	$scope.$watch("userSv.getAccounts()",function(accounts){

		if (accounts.length > 0) {
			$scope.accounts = accounts;
			$scope.accountsLoaded = true;
		}

		if ($scope.accountsLoaded) {
			$scope.generatePagesList();
		}
	},true);

	$scope.$watch("userSv.getThemeConfig()",function(configNew,configOld){

		if (!angular.equals(configNew, configOld)) {
			$scope.config = configNew;
			$scope.configLoaded = true;
		}
	},true);

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
    });

	$scope.scrollTo = function(element) {
		$('html, body').animate({
			scrollTop: element[0].offsetTop
		}, 500);
	}

	$scope.scrollToSection = function(section) {
		var element = angular.element(document.querySelector("#"+section));
		$scope.current = section;
		$scope.scrollTo(element);
	}
	$scope.resetIframes = function(index) {

	    angular.forEach(document.querySelectorAll("#content_"+index+" iframe"), function(iframe, index) {
	    	iframe.src = iframe.src;
	    });
	    angular.forEach(document.querySelectorAll("#content_"+index+" video"), function(iframe, index) {
	    	iframe.src = iframe.src;
	    });
	    angular.forEach(document.querySelectorAll("#content_"+index+" audio"), function(iframe, index) {
	    	iframe.src = iframe.src;
	    });
	}

	$scope.showComments = function(index) {
		$scope.isComments	= !$scope.isComments;
		$scope.indexComments= index;
	}

    $scope.getContentCommentsHash = function() {
    	var c = $scope.list[$scope.indexComments];
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

	$scope.getStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}


		appSv.setMyWH(appSv.getHeight() - $scope.menuHeight);
		return {
			'min-height':appSv.getHeight() - $scope.menuHeight + 'px',
			'opacity': ($scope.isComments) ? '0':'1',
			'margin-top': $scope.menuHeight + 'px',
			//'background-color': $scope.config.custom.colors.background.value
		};
	}

	$scope.getCommentsColor = function() {

		var color = $scope.config.custom.colors.background.value.replace("#","");

		if (contentSv.getContrast50(color) == 'white') {
			return "dark";
		}
		return "light";
	}

	$scope.getCommentsStyle = function() {
		var style = {
			'height':appSv.getHeight() - $scope.menuHeight + 'px',
			'top':$scope.menuHeight + 'px',
			'left':($scope.isComments) ? '0':'-100%',
			'background-color':$scope.config.custom.colors.background.value,
			'color':$scope.config.custom.colors.contentText.value
		}

		return style;
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

	}

	$scope.setFont = function() {

	}

	$scope.getControlsStyle = function() {
    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

    	return {
    		'top':$scope.menuHeight + 'px',
    		'background-color':$scope.config.custom.colors.contentBackground.value
    	}
	}

	$scope.getControlsButtonStyle = function() {
    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

		return {
			'color':$scope.config.custom.colors.contentText.value,
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


    $scope.getMenuStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

		return {
			'background-color':$scope.config.custom.colors.contentBackground.value,
			'color':$scope.config.custom.colors.contentText.value,
		};
    }

	$scope.setBackground = function() {


	}
}