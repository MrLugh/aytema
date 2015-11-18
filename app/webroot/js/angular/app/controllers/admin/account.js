function adminAccountCo($scope,userSv,appSv,contentSv) {

	$scope.user 	= userSv.getUser();
	$scope.networks = appSv.getNetworks();
	$scope.appSv	= appSv;

	$scope.list		= [];
	$scope.loading 	= false;
	$scope.noMore 	= false;

	$scope.offset 	= 0;
	$scope.limit	= 12;
	$scope.filters	= {'concepts':[],'networks':[$scope.account.network]};
	$scope.concepts = [];

	$scope.showAdd 		= false;
	$scope.showFilters 	= false;
	$scope.toAdd 		= false;

	$scope.manageAdd = function() {
		$scope.showAdd = !$scope.showAdd;
	}

	$scope.manageFilters = function() {
		$scope.showFilters = !$scope.showFilters;
	}

	$scope.getListLength = function() {
		return $scope.list.length;
	}

	$scope.generateConceptsList = function() {

		var concepts = [];
		for (var x in $scope.networks[$scope.account.network]['concepts']){
			concept = $scope.networks[$scope.account.network]['concepts'][x];
			concepts.push(concept);
		}

		$scope.concepts = concepts;
	}

	$scope.initFilters = function() {

		var filters	= {'concepts':[],'networks':[$scope.account.network]};

		for (var x in $scope.concepts){
			concept = $scope.concepts[x];
			filters['concepts'].push(concept);
		}

		$scope.filters = filters;

	}

	$scope.clearList = function() {
		$scope.list = [];
	}

	$scope.setList = function() {
		if (!contentSv.isLoading()) {
			var params			= [];
			params['concepts']	= JSON.parse(JSON.stringify($scope.filters.concepts));
			params['offset']	= $scope.offset;
			params['limit']		= $scope.limit;
			params['accounts'] = [$scope.account.id];

			params['username']	= $scope.user.username;
			if (angular.isDefined($scope.user['id'])) {
				params['user_id']	= $scope.user.id;
			}

			contentSv.getContentsByFilters(params).then(
				function(data) {

					$scope.loading 	= false;

					if (!angular.isDefined(data.contents)) {
						return false;
					}

					var contents = data.contents;
					if (contents.length) {
						for (var x in contents) {
							content = contents[x].Content;
							if ($scope.filters.concepts.indexOf(content.concept) != -1)	{
								$scope.list.push(content);
							}
						}
						$scope.offset += $scope.limit;
					} else {
						$scope.noMore = true;
					}
				},
				function(reason) {
					console.log('Failed: ', reason);
				},
				function(update) {
					console.log('Got notification: ', update);
				}
			);
		}
	}

	$scope.filter = function(concept) {

		var ixConcept = $scope.filters.concepts.indexOf(concept);
		$scope.noMore = false;

		if (ixConcept != -1) {
			var filters = [];
			for (var x in $scope.filters.concepts ) {

				if (concept != $scope.filters.concepts[x]) {
					filters.push($scope.filters.concepts[x]);
				}				
			}
			if (filters.length) {
				$scope.filters.concepts = filters;
			}

		} else {
			$scope.filters.concepts.push(concept);
		}

		//$scope.offset	= 0;
	}

	$scope.moreContent = function() {
		if (!$scope.noMore && !contentSv.isLoading() && !$scope.loading) {
			$scope.loading 	= true;
			$scope.setList();
		}
	}

	$scope.filterStyle = function(concept) {
		var ixConcept = $scope.filters.concepts.indexOf(concept);
		if (ixConcept == -1 ) {
			return {"opacity":"0.3"};
		}
		return {"opacity":"1"};
	}

	$scope.statIcon = function(stat_name) {
		return contentSv.getStatIcon(stat_name);
	}

	$scope.canShowStat = function(stat) {
		return (parseInt(stat) != 0) ? true : false;
	}	

	$scope.manageAction = function(index) {

		$scope.list[index].status == 'disabled' ? $scope.activate(index) : $scope.delete(index);
	}

	$scope.delete = function(index) {

		contentSv.deleteContent($scope.list[index].id).
		then(function(data){
			if (data.message == "Deleted") {
				$scope.list[index].status = "disabled";
			}
		});

	}

	$scope.activate = function(index) {

		contentSv.activateContent($scope.list[index].id).
		then(function(data){
			if (data.message == "Activated") {
				$scope.list[index].status = "enabled";
			}
		});

	}

	$scope.move = function(direction) {
		$scope.$parent.move(direction);
	}

	$scope.closeAccount = function() {
		$scope.$parent.closeAccount();
	}	

	$scope.userSv	= userSv;
	$scope.contentSv= contentSv;

	$scope.$watch('account', function(account) {
		if (!angular.equals({},account)) {
			$scope.noMore = false;
			$scope.generateConceptsList();
			$scope.initFilters();
			$scope.offset = 0;
			$scope.scrollToTop();
			$scope.list = [];
			$scope.moreContent();
		}
	});

	$scope.$watch('appSv.getDashboardMenuMode()', function() {
		$scope.getPageHeaderStyle();
	});	

	$scope.getPageHeaderStyle = function() {

		var minus = appSv.getDashboardMenuMode() ? 300 : 50;
		var style = {'width':'calc(100% - '+minus+'px)'};
		return style;
	};

	$scope.conceptIcon = function(concept) {
		return contentSv.getConceptIcon(concept);
	};

	$scope.showAddContent = function(concept) {
		$scope.isAdding = true;
		$scope.toAdd	= concept;
		$scope.objAdd	= {};
	};

	$scope.showEditContent = function(index) {
		$scope.isAdding = true;
		$scope.toAdd	= $scope.list[index].concept;
		$scope.objAdd	= $scope.list[index];
	}

	$scope.hideAddContent = function() {
		$scope.toAdd 	= false;
		$scope.isAdding = false;
		$scope.offset = 0;
		$scope.clearList();
		$scope.setList();
	};

	$scope.isContentFiltered = function(content) {
		return $scope.filters.concepts.indexOf(content.concept) != -1 ? true : false;
	};

	$scope.canShowContent = function(content) {
		return content.status != "inconsistent";
	};
	
}