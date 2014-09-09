function socialnetCo($scope,$routeParams,$location,appSv,userSv,contentSv,$sce,$window,$timeout) {

	$scope.appSv 	= appSv;
	$scope.contentSv= contentSv;
	$scope.$location = $location;

	$scope.networks = appSv.getNetworks();

	$scope.mode 	= appSv.getNavigationMode();

	$scope.limit 	= 10;
	$scope.content 	= {};

	$scope.current  = 'page_profile';

	$scope.currentQueue = 0;

	$scope.network 			= $routeParams.network;
	$scope.external_user_id	= $routeParams.external_user_id;

	$scope.showFooter = false;
	$scope.isFullWidth= false;

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

	$scope.resetIframes = function(selector) {

		$timeout(function(){
		    angular.forEach(document.querySelectorAll("#"+selector+" iframe"), function(iframe, index) {
		    	iframe.src = iframe.src;
		    });
		    angular.forEach(document.querySelectorAll("#"+selector+" video"), function(iframe, index) {
		    	iframe.src = iframe.src;
		    });
		    angular.forEach(document.querySelectorAll("#"+selector+" audio"), function(iframe, index) {
		    	iframe.src = iframe.src;
		    });
		},1000);
	}

	$scope.moveQueue = function(direction) {

		var indexCurrent = $scope.currentQueue;

		var oldest = $scope.currentQueue;

		if (direction > 0) {
			indexCurrent++;
		} else {
			indexCurrent--;
		}

		if (indexCurrent == contentSv.getQueue().length) {
			indexCurrent = 0;
		}
		if (indexCurrent < 0) {		
			indexCurrent = contentSv.getQueue().length - 1;
		}

		$scope.currentQueue = indexCurrent;
    	if ($scope.isFullWidth) {
    		$scope.scrollToQueue('queue_'+$scope.currentQueue);
			$scope.resetIframes("queue_"+oldest);
    	}

	}


	$scope.movePage = function(concept,direction) {

		var indexCurrent = angular.copy($scope.content[concept].current);

		var oldest = angular.copy($scope.content[concept].current);

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

		$scope.resetIframes("content_"+oldest);

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

    $scope.scrollToQueue = function(id) {
    	$timeout(function(){

    		var element = angular.element(document.querySelector("#"+id));
			$('.queuedList').animate({
				scrollLeft: element[0].offsetLeft
			}, 500);

    	},500);
    }

    $scope.fullWidht = function(index) {
    	$scope.currentQueue = index;
    	$scope.isFullWidth = !$scope.isFullWidth;
    	if ($scope.isFullWidth) {
    		$scope.scrollToQueue('queue_'+index);
    	}
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
		var style = {'width':appSv.getWidth() + 'px'};

		/*
		style['overflow-x'] = 'auto';
		if ($scope.isFullWidth) {
			style['overflow-x'] = 'hidden';
		}
		*/

		return style;
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

	$scope.changeMode = function() {
		appSv.setNavigationMode(!$scope.mode);
	}

	$scope.getModeTitle = function() {
		return $scope.mode ? 'Text mode' : 'Full Height mode';
	}

	$scope.moveSocialnet = function(direction) {
		var list = appSv.getSocialnets();
		var current = -1;

		for (var x in list) {
			var socialnet = list[x];
			if (socialnet.id == $scope.account.id) {
				current = x;				
			}
		}

		if (direction > 0) {
			current++;
		} else {
			current--;
		}

		if (current == appSv.getSocialnets().length) {
			current = 0;
		}
		if (current < 0) {		
			current = appSv.getSocialnets().length - 1;
		}

		var socialnet = list[current];
		$location.path("/socialnets/"+socialnet.network+"/"+socialnet.external_user_id);
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

	$scope.$watch("appSv.getNavigationMode()",function(mode){
		$scope.mode = mode;
	});	

	$scope.$watch("contentSv.getQueue()",function(queue){
		if (queue.length>0) {
			$scope.currentQueue = queue.length - 1;
			$scope.scrollToQueue('queue_'+$scope.currentQueue);
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
    	
    	if ($scope.isFullWidth) {
    		$scope.scrollToQueue('queue_'+$scope.currentQueue);
    	}
	});

}