function adminAccountCo($scope,userSv,appSv,contentSv) {

	$scope.accountContentList	= [];
	$scope.concepts				= [];

	$scope.generateConceptsList = function() {

		for (var x in $scope.networks[$scope.account.network]['concepts']){
			concept = $scope.networks[$scope.account.network]['concepts'][x];
			$scope.concepts.push(concept);
		}
	}

	$scope.initFilters = function() {

		$scope.filters = {'concepts':[]};

		for (var x in $scope.concepts){
			concept = $scope.concepts[x];
			$scope.filters['concepts'].push(concept);
		}

	}
	$scope.generateConceptsList();
	$scope.initFilters();

	// TODO
	contentSv.loadContent();

	$scope.setList = function() {

		var contents = contentSv.getListsByNetwork($scope.account.network).all;

		var list= [];
		for (var x in contents) {

			content = contentSv.getDicContentByKey(contents[x]);
			if ($scope.filters.concepts.indexOf(content.concept) != -1)	{
				list.push(content);
			}
		}
		if (!angular.equals($scope.accountContentList, list)) {
			$scope.accountContentList = list;
		}
		//console.log("setList");
		//console.log(contents);
		//console.log($scope.accountContentList);
	}

	$scope.filter = function(concept) {

		var ixConcept = $scope.filters.concepts.indexOf(concept);

		if (ixConcept != -1) {
			delete $scope.filters.concepts[ixConcept];
		} else {
			$scope.filters.concepts.push(concept);
		}

	}

	$scope.moreContent = function() {
		contentSv.loadContent();
	}	

	$scope.filterStyle = function(concept) {
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
		//console.log("Watch filters");
		$scope.setList();
	},true);

	$scope.$watch('contentSv.getDicContent()', function(value) {
		//console.log("Watch getDicContent");
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