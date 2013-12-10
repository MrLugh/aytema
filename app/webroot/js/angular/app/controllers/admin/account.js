function adminAccountCo($scope,userSv,appSv,contentSv) {

	$scope.accountContentList	= [];
	$scope.concepts				= [];

	$scope.offset 	= 0;
	$scope.limit	= 10;
	$scope.filters	= {'concepts':[],'networks':[$scope.account.network]};
	$scope.concepts = [];

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
	$scope.generateConceptsList();
	$scope.initFilters();

	$scope.setList = function() {

		if (!contentSv.isLoading()) {

			var params					= JSON.parse(JSON.stringify($scope.filters));
			params['offset']			= $scope.offset;
			params['limit']				= $scope.limit;
			params['external_user_id']	= $scope.account.external_user_id;

			contentSv.getContentsByFilters(params).then(
				function(data) {
					var contents = data.contents;

					if (contents.length) {
						for (var x in contents) {

							content = contents[x].Content;
							if ($scope.filters.concepts.indexOf(content.concept) != -1)	{
								$scope.accountContentList.push(content);
							}
						}
						$scope.offset += $scope.limit;
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

		$scope.offset	= 0;
		$scope.accountContentList = [];
		$scope.setList();
	}

	$scope.moreContent = function() {
		if (!contentSv.isLoading()) {
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

	$scope.delete = function(index) {
		contentSv.deleteContent($scope.accountContentList[index].id).
		then(function(data){
			if (data.message == "Deleted") {
				//$scope.removeFromMasonry($scope.accountContentList[index]);
				$scope.accountContentList.splice(index,1);
			}
		});
	}

	$scope.getContainerStyle = function() {
		return {'min-height':appSv.getHeight() - $scope.getOffsetTop() + 'px'};
	}

	$scope.getContentSize = function(index) {
		var small 		= ['post','quote','chat','photo'];
		var medium 		= ['video','track'];
		var large 		= [];
		var extralarge 	= [];
		var concept = $scope.accountContentList[index].concept;

		if (small.indexOf(concept) != -1 ) {
			if (concept == 'post' && $scope.account.network == 'facebook') {
				return 'xlarge';
			}
			if (concept == 'post' && $scope.account.network == 'twitter') {
				return 'medium';
			}			
			return 'small';
		}
		if (medium.indexOf(concept) != -1 ) {
			return 'medium';
		}
		if (large.indexOf(concept) != -1 ) {
			return 'large';
		}
		if (extralarge.indexOf(concept) != -1 ) {
			return 'xlarge';
		}

	}

	$scope.move = function(direction) {
		$scope.$parent.move(direction);
	}

	$scope.closeAccount = function() {
		$scope.$parent.closeAccount();
	}	

	$scope.userSv	= userSv;
	$scope.contentSv= contentSv;

	$scope.$watch('account', function(oldValue,newValue) {
		if (oldValue.id != newValue.id) {
			//$scope.reinitMasonry();
			$scope.offset = 0;
			$scope.accountContentList = [];
			$scope.generateConceptsList();
			$scope.initFilters();
			$scope.setList();
		}

	});

	$scope.conceptIcon = function(concept) {
		return contentSv.getConceptIcon(concept);
	}

	$scope.generateConceptsList();
	$scope.initFilters();
	$scope.setList();
	
}