function EventsCo($scope,appSv,contentSv,$sce) {

	$scope.contentSv= contentSv;
	$scope.eventlist= [];
	$scope.loading 	= false;
	$scope.limit 	= 6;
	$scope.offset 	= 0;

	$scope.setList = function() {

		$scope.list = contentSv.getPageList('events').list.slice($scope.offset,$scope.offset+$scope.limit);
		if ($scope.list.length == $scope.limit) {
			$scope.offset = $scope.offset + $scope.limit;
		} else {
			$scope.offset = $scope.offset + $scope.list.length;
		}

		for (var x in $scope.list) {

			var content = $scope.list[x];
			$scope.eventlist.push(content);
		}

		if ($scope.offset < contentSv.getPageList('events').list.length) {
			$scope.loading = false;
		}

	}


	$scope.$watch("contentSv.getPageList('events')",function(list){

		if (angular.isDefined(list.list)) {
			$scope.setList();
		}

	},true);	

	$scope.getDescription = function(index) {

		return $sce.trustAsHtml($scope.eventlist[index].description);
	}

	$scope.getTitleStyle = function() {
		return {
			'background-color': $scope.config.custom.colors.contentBackground.value,
			'color': $scope.config.custom.colors.contentText.value
		}
	}	

	$scope.loadMore = function() {
		$scope.$parent.$parent.getContent("events");
		$scope.setList();
	}

}