function socialnetCo($scope,$routeParams,appSv,userSv,contentSv,$sce,$window) {

	$scope.appSv 	= appSv;
	$scope.contentSv= contentSv;
	$scope.networks = appSv.getNetworks();

	$scope.limit 	= 10;
	$scope.content 	= {};

	$scope.current  = 'page_profile';

	$scope.network 			= $routeParams.network;
	$scope.external_user_id	= $routeParams.external_user_id;

	$scope.showFooter = false;


	$scope.loadUsers = function() {
		userSv.loadUsersForAccount({
			network:$scope.account.network,
			external_user_id:$scope.account.external_user_id
		})
		.then(function(data){
			if (data.users.length > 0) {
				$scope.users = [];
				for (var x in data.users) {
					var user = data.users[x]['User'];
					$scope.users.push(user);
				}
			}
		});
	}


	$scope.loadAccount = function() {
		userSv.loadAccounts({
			networks:[$routeParams.network],
			external_user_id:$routeParams.external_user_id,
			limit:1
		})
		.then(function(data){
			if (data.socialnets.length > 0) {
				$scope.account = data.socialnets[0]['Socialnet'];
				$scope.loadUsers();
			}
		});
	}
	$scope.loadAccount();

	$scope.isAccount = function() {
		return angular.isDefined($scope.account) && $scope.account != {};
	}

	$scope.getContent = function(concept) {

		var params			= [];
		params['concepts']	= [concept];
		params['networks']	= [$scope.account.network];
		params['offset']	= $scope.content[concept].offset;
		params['limit']		= $scope.limit;
		params['accounts']	= [$scope.account.id];

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

	$scope.generatePagesList = function() {

		$scope.content 	= {};

		var concepts = [];
		for (var x in $scope.networks[$scope.account.network]['concepts']){
			concept = $scope.networks[$scope.account.network]['concepts'][x];
			concepts.push(concept);
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

	$scope.isCurrent = function(concept,index) {
		return $scope.content[concept].current == index;
	}

	$scope.resetIframes = function(index) {

	    angular.forEach(document.querySelectorAll("#content_"+index+" iframe"), function(iframe, index) {
	    	iframe.src = iframe.src;
	    });
	}


	$scope.movePage = function(concept,direction) {

		var indexCurrent = angular.copy($scope.content[concept].current);

		$scope.resetIframes(indexCurrent);

		if (direction > 0) {
			indexCurrent++;
		} else {
			indexCurrent--;
		}

		if (indexCurrent == $scope.content[concept].list.length) {
			indexCurrent = 0;
		}
		if (indexCurrent < 0) {		
			indexCurrent = $scope.content[concept].list.length - 1;
		}

		$scope.content[concept].current = indexCurrent;

		if ( $scope.content[concept].list.length - 1 - $scope.content[concept].current < 5 ) {
			$scope.getContent(concept);
		}

	}

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

	$scope.getPluralizedConcepts = function(concept) {
		return appSv.getPluralizedConcepts()[concept];
	}

	$scope.canShowStat = function(stat) {
		return (parseInt(stat) != 0) ? true : false;
	}

	$scope.statIcon = function(stat_name) {
		return contentSv.getStatIcon(stat_name);
	}

	$scope.conceptIcon = function(concept) {
		return contentSv.getConceptIcon(concept);
	}

    $scope.footer = function() {
    	$scope.showFooter = !$scope.showFooter;
    };

    $scope.getFooterStyle = function() {

    	var style = {};
	   	if ($scope.showFooter == true) {
	   		style['bottom'] =  0;
	   		return style;
    	}
    	style['bottom'] = -$scope.footerHeight + 'px';

	   	return style;
    }

    $scope.getFooterButtonStyle = function() {

    	var style = {};

	   	if ($scope.showFooter == true) {
	   		style['bottom'] = '100%';
    	} else {
    		style['bottom'] = '0';
    	}
	   	return style;
    };

	$scope.getQueueStyle = function() {
		return {'width':appSv.getWidth() + 'px'};
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

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
    });

	$scope.$watch('account', function(account) {
		if (angular.isDefined(account)) {
			$scope.generatePagesList();
		}
	});

	$scope.$watch("contentSv.getQueue()",function(queue){
		if (queue.length>0) {
			$scope.showFooter = true;
		}
	},true);

	$scope.$watchCollection("[showFooter]",function(values){
		$scope.getFooterStyle();
	});	

	angular.element($window).bind('resize',function() {
		if (angular.isDefined($scope.current)) {
			$scope.scrollToSection($scope.current);
		}
	});

}