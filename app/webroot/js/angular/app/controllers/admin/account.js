function adminAccountCo($scope,userSv,appSv,contentSv) {

	$scope.accountContentList	= [];
	$scope.concepts				= [];

	$scope.offset 	= 0;
	$scope.limit	= 10;
	$scope.filters	= {'concepts':[],'networks':[$scope.account.network]};

	$scope.generateConceptsList = function() {

		console.log("generateConceptsList");
		for (var x in $scope.networks[$scope.account.network]['concepts']){
			concept = $scope.networks[$scope.account.network]['concepts'][x];
			$scope.concepts.push(concept);
		}
	}

	$scope.initFilters = function() {

		console.log("initFilters");
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
			console.log("Pido para: ");
			var params = jQuery.extend( false, $scope.filters, {'offset':$scope.offset,'limit':$scope.limit} );
			contentSv.getContentsByFilters(params).then(
				function(data) {
					console.log('Success: ',data);
					var contents = data.contents;

					var list = $scope.offset == 0 ? [] : $scope.accountContentList;

					for (var x in contents) {

						content = contents[x].Content;
						if ($scope.filters.concepts.indexOf(content.concept) != -1)	{
							list.push(content);
						}
					}
					if (!angular.equals($scope.accountContentList, list)) {
						$scope.accountContentList = list;
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

		console.log("filter by ",concept);
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

	}

	$scope.moreContent = function() {
		console.log("moreContent");
		$scope.offset += $scope.limit;
		$scope.setList();
		//contentSv.loadContent();
	}	

	$scope.filterStyle = function(concept) {
		console.log("filterStyle");
		var ixConcept = $scope.filters.concepts.indexOf(concept);
		if (ixConcept == -1 ) {
			return {"opacity":"0.3"};
		}
		return {"opacity":"1"};
	}

	$scope.delete = function(index) {
		contentSv.deleteContent($scope.accountContentList[index]);
		$scope.setList();
		return false;
	}

	$scope.getStyle = function() {

		return {'min-height':appSv.getHeight() - $scope.getOffsetTop() + 'px'};
	}

	$scope.userSv	= userSv;
	$scope.contentSv= contentSv;

	$scope.$watch('filters', function(value) {
		console.log("Watch filters ",value);
		$scope.offset	= 0;
		$scope.limit	= 10;
		$scope.setList();
	},true);

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
        $scope.getStyle();	
    });

	$scope.conceptIcon = function(concept) {
		return contentSv.getConceptIcon(concept);
	}

}