function socialnetCo($scope,$routeParams,$location,appSv,userSv,contentSv) {

	$scope.appSv 	= appSv;
	$scope.networks = appSv.getNetworks();

	$scope.limit 	= 10;
	$scope.content 	= {};

	$scope.network 			= $routeParams.network;
	$scope.external_user_id	= $routeParams.external_user_id;

	$scope.loadAccount = function() {
		userSv.loadAccounts({
			networks:[$routeParams.network],
			external_user_id:$routeParams.external_user_id,
			limit:1
		})
		.then(function(data){
			if (data.socialnets.length > 0) {
				$scope.account = data.socialnets[0]['Socialnet'];
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
					contentSv.setPageList(concept,$scope.content[concept]);
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

	$scope.movePage = function(concept,direction) {

		var indexCurrent = $scope.content[concept].current;

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

		$scope.content[concept].current = indexCurrent;
	}

	$scope.scrollTo = function(element) {
		$('html, body').animate({
			scrollTop: element[0].offsetTop
		}, 500);
	}

	$scope.scrollToSection = function(section) {
		var element = angular.element(document.querySelector("#"+section));
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

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
    });

	$scope.$watch('account', function(account) {
		if (angular.isDefined(account)) {
			$scope.generatePagesList();
		}
	});    


}