function themeDjCo($scope,appSv,userSv,contentSv,$sce) {

	$scope.appSv 	= appSv;
	$scope.contentSv= contentSv;
	$scope.userSv	= userSv;
	$scope.user 	= userSv.getUser();
	$scope.networks = appSv.getNetworks();

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	$scope.limit 	= 100;
	$scope.contents	= {};
	$scope.current	= 'page_profile';
	$scope.content	= {};

	$scope.validPages = ['photo','track','video','post','event'];

	$scope.showingDetail = false;

	$scope.config		= {};
	$scope.configLoaded = false;
    $scope.showConfig = false;
	$scope.tabs = [
		{ title:"Background", key:"background", active: true },
	];

	userSv.loadThemeConfig('dj');
	userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});

	$scope.isLogged = function() {
		return userSv.isLogged();
	}

	$scope.showDetail = function(content) {
		if (!angular.equals({}, content)) {
			var element = angular.element(document.querySelector("#page_detail"));
			$scope.showingDetail = true;
			setTimeout(function(){
				angular.element(document.querySelector("body")).css('overflow','hidden');
				$scope.scrollTo(element);
			},500);
			
		} else {
			$scope.scrollToSection($scope.current);
			angular.element(document.querySelector("body")).css('overflow','initial');
			$scope.showingDetail = false;
		}
		$scope.content = content;
		$scope.details = [$scope.content];
	}

	$scope.moveDetail = function(direction) {

		var currentPos = $scope.contents[$scope.content.concept].list.indexOf($scope.content);

        if (direction > 0) {currentPos++;} else {currentPos--;}

        if (currentPos < 0 ) {
            currentPos = $scope.contents[$scope.content.concept].list.length - 1;
        }

        if (currentPos == $scope.contents[$scope.content.concept].list.length ) {
            currentPos = 0;
        }

        $scope.showDetail($scope.contents[$scope.content.concept].list[currentPos]);
	}	

	$scope.generatePagesList = function() {

		$scope.contents 	= {};

		var concepts = [];

		for (var y in $scope.accounts) {
			var account = $scope.accounts[y]['Socialnet'];
			for (var x in $scope.networks[account.network]['concepts']){
				concept = $scope.networks[account.network]['concepts'][x];
				if (concepts.indexOf(concept) == -1 && 
					$scope.validPages.indexOf(concept) != -1) {
					concepts.push(concept);
				}	
			}
		}
		$scope.concepts = concepts;

		$scope.pages 	= [];
		$scope.contents  = {};
		for (var x in $scope.concepts) {

			var concept = $scope.concepts[x];

			$scope.pages.push(concept);

			if (!angular.isDefined($scope.contents[concept])) {
				$scope.contents[concept] = {'offset':0,'list':[],'current':0};
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
		params['offset']	= $scope.contents[concept].offset;
		params['limit']		= $scope.limit;
		params['accounts']	= accounts;

		contentSv.getContentsByFilters(params).then(
			function(data) {
				var contents = data.contents;
				if (data.contents.length) {
					for (var x in contents) {
						content = contents[x].Content;
						$scope.contents[concept].list.push(content);
					}
					$scope.contents[concept].offset = $scope.contents[concept].list.length;
					//contentSv.setPageList(concept,$scope.contents[concept]);
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

	$scope.getDescription = function(content) {

		return $sce.trustAsHtml(contentSv.getDescription(content));
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
			$scope.setBackground();
		}
	},true);

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
    });

	$scope.scrollTo = function(element) {
		$('html, body').animate({
			scrollTop: element[0].offsetTop
		}, 1000);
	}

	$scope.scrollToSection = function(section) {
		var element = angular.element(document.querySelector("#"+section));
		$scope.current = section;
		$scope.scrollTo(element);
	}
	$scope.resetIframes = function(index) {

	    angular.forEach(document.querySelectorAll("#content"+index+" iframe"), function(iframe, index) {
	    	iframe.src = iframe.src;
	    });
	    angular.forEach(document.querySelectorAll("#content"+index+" video"), function(iframe, index) {
	    	iframe.src = iframe.src;
	    });
	    angular.forEach(document.querySelectorAll("#content"+index+" audio"), function(iframe, index) {
	    	iframe.src = iframe.src;
	    });
	}

    $scope.getContentCommentsHash = function() {
    	var c = $scope.content;
    	return "http://cloudcial.com/comments/"+c.network + '_' + c.external_user_id + '_' + c.concept + '_' + c.external_id;
    }	

    $scope.adminTheme = function() {
    	$scope.showConfig = !$scope.showConfig;
    };

    $scope.footer = function() {
    	$scope.showFooter = !$scope.showFooter;
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


	$scope.setBackground = function() {

		var element = angular.element(document.querySelector('#page_profile'));
		$(element[0]).css('background-image','url("'+$scope.config.custom.background.selected+'")');

	}

}