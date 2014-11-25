function themePhotographerCo($scope,appSv,userSv,contentSv,$sce) {

	$scope.appSv 	= appSv;
	$scope.contentSv= contentSv;
	$scope.userSv	= userSv;
	$scope.networks = appSv.getNetworks();
	delete $scope.networks['twitter'];

	userSv.search({search:userSv.getUser().username,limit:1}).then(function(data){
		$scope.user = data.users[0]['User'];
	});	

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	$scope.limit 	= {
		'photo':20,
		'video':20,
		'track':20,
		'event':20,
		'post':20,
	};
	$scope.contents	= {};
	$scope.loadingContent = {};

	$scope.config		= {};
	$scope.configLoaded = false;
    $scope.showConfig = false;
	$scope.tabs = [
		{ title:"Background", key:"background", active: true },
	];

	userSv.loadThemeConfig('photographer');
	userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});

	$scope.isLogged = function() {
		return userSv.isLogged();
	};

	$scope.generatePagesList = function() {

		$scope.contents 	= {};

		var concepts = [];

		for (var y in $scope.accounts) {
			var account = $scope.accounts[y]['Socialnet'];
			if (!angular.isDefined($scope.networks[account.network])) {
				continue;
			}
			for (var x in $scope.networks[account.network]['concepts']){
				concept = $scope.networks[account.network]['concepts'][x];
				if (concepts.indexOf(concept) == -1) {
					concepts.push(concept);
				}	
			}
		}
		$scope.concepts = concepts;

		$scope.pages 	= ['detail','profile'];
		$scope.contents  = {};
		for (var x in $scope.concepts) {

			var concept = $scope.concepts[x];

			$scope.pages.push(concept);

			if (!angular.isDefined($scope.contents[concept])) {
				$scope.contents[concept] = {'offset':0,'list':[],'current':0};
				$scope.getContent(concept);
			}
		}

		$scope.pages.push('contact');
		$scope.pages.push('about');
		$scope.pages.push('footer');
	};

	$scope.getContent = function(concept) {

		var params = [];

		$scope.loadingContent[concept] = true;

		var networks = [];
		var accounts = [];
		angular.forEach($scope.accounts, function(account,key) {

			if (angular.isDefined($scope.networks[account.Socialnet.network])) {

				if (networks.indexOf(account.Socialnet.network) == -1) {
					networks.push(account.Socialnet.network);
				}
				if (accounts.indexOf(account.Socialnet.id) == -1) {
					accounts.push(account.Socialnet.id);
				}

			}

		});

		params['concepts']	= [concept];
		params['networks']	= networks;
		params['offset']	= $scope.contents[concept].offset;
		params['limit']		= $scope.limit[concept];
		params['accounts']	= accounts;
		params['status']	= 'enabled';

		contentSv.getContentsByFilters(params).then(
			function(data) {
				var contents = data.contents;
				if (data.contents.length) {
					for (var x in contents) {
						content = contents[x].Content;
						$scope.contents[concept].list.push(content);

						if (content.concept == 'event' &&
							angular.equals({}, $scope.currentEvent)
							) {
								$scope.setCurrentEvent(content);
						}

					}
					$scope.contents[concept].offset = $scope.contents[concept].list.length;
					//contentSv.setPageList(concept,$scope.contents[concept]);
					
					var list = document.querySelector("#"+concept+"_list");
					if (list) {
						if (angular.isDefined($scope.page_intervals[concept])) {
							clearTimeout($scope.page_intervals[concept]);
						}
						//$scope.page_intervals[concept] = setTimeout(function(){
							//clearTimeout($scope.page_intervals[concept]);
							list = document.querySelector("#"+concept+"_list");
							var to_top = ['post','photo','event'];
							if (to_top.indexOf(concept) != -1) {
								$(list).animate({
									scrollTop: angular.element(list)[0].scrollHeight
								},2500);
							}
						//},1000);
					}

					window.addEventListener( 'DOMContentLoaded', $scope.loadingContent[concept] = false, false);

				} else {
					$scope.loadingContent[concept] = true;
				}
			},
			function(reason) {
				//console.log('Failed: ', reason);
			},
			function(update) {
				//console.log('Got notification: ', update);
			}
		);

	};

	$scope.getPluralizedConcepts = function(concept) {
		return appSv.getPluralizedConcepts()[concept];
	};

	$scope.getPlayer = function(content) {

		return $sce.trustAsHtml(contentSv.cleanSource(contentSv.getPlayer(content)));
	};

	$scope.getDescription = function(content) {

		return $sce.trustAsHtml(contentSv.getDescription(content));
	};

	$scope.getBiography = function() {

		return $sce.trustAsHtml($scope.user.biography);
	};

	$scope.getMapSrc = function() {
		return "https://maps.googleapis.com/maps/api/staticmap?"+
		"sensor=false"+
		"&size=850x850"+
		"&markers="+encodeURI($scope.user.address)+
		"&client_id="+encodeURI("AIzaSyDgE0KcEAKdRQl9IReB4E7ZBZpQOL2Cxz8");
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

	$scope.resetIframes = function(index) {

	    angular.forEach(document.querySelectorAll("iframe"), function(iframe, index) {
	    	iframe.src = iframe.src;
	    });
	};

	$scope.networkIcon = function(network) {
		return contentSv.getNetworkIcon(network);
	};

    $scope.getContentCommentsHash = function() {
    	var c = $scope.content;
    	return "http://cloudcial.com/comments/"+c.network + '_' + c.external_user_id + '_' + c.concept + '_' + c.external_id;
    };	

    $scope.adminTheme = function() {
    	$scope.showConfig = !$scope.showConfig;
    };

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