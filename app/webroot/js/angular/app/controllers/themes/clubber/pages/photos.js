function PhotosCo($scope,appSv,contentSv,$sce) {

	$scope.contentSv= contentSv;
	$scope.photolist= [];
	$scope.loading 	= false;
	$scope.limit 	= 10;
	$scope.offset 	= 0;

	$scope.setList = function() {

		$scope.list = contentSv.getPageList('photos').list.slice($scope.offset,$scope.offset+$scope.limit);
		if ($scope.list.length == $scope.limit) {
			$scope.offset = $scope.offset + $scope.limit;
		} else {
			$scope.offset = $scope.offset + $scope.list.length;
		}

		for (var x in $scope.list) {

			var content = $scope.list[x];
			$scope.photolist.push(content);
		}

		if ($scope.offset < contentSv.getPageList('photos').list.length) {
			$scope.loading = false;
		}

	}


	$scope.$watch("contentSv.getPageList('photos')",function(list){

		if (angular.isDefined(list.list)) {
			$scope.setList();
		}

	},true);	

	$scope.getDescription = function(index) {

		return $sce.trustAsHtml($scope.photolist[index].description);
	}

	$scope.getTitleStyle = function() {
		return {
			'background-color': $scope.config.custom.colors.contentBackground.value,
			'color': $scope.config.custom.colors.contentText.value
		}
	}	

	$scope.loadMore = function() {
		if ($scope.loading) {
			return false;
		}
		$scope.loading = true;
		if ($scope.offset + $scope.limit * 3 > contentSv.getPageList('photos').list.length ) {
			$scope.$parent.$parent.getContent("photos");
		}
		$scope.setList();
	}

}