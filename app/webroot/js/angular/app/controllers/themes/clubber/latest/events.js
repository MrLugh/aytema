function latestEventsCo($scope,appSv,contentSv,$sce) {

	$scope.contentSv= contentSv;

	$scope.setList = function() {

	}

	$scope.$watch("contentSv.getPageList('events')",function(list){

		if (angular.isDefined(list.list)) {
			$scope.list = list.list.slice(0,$scope.limit);
			$scope.setList();
		}

	},true);

	$scope.getDescription = function(index) {

		return $sce.trustAsHtml(contentSv.getDescription($scope.list[index]));
	}

	$scope.getEventSize = function() {

		if ($scope.list.length == 3) {
			return '33%';
		}

		if ($scope.list.length == 2) {
			return '50%';
		}

		return '100%';
	}

}