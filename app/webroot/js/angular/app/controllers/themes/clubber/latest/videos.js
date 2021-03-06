function latestVideosCo($scope,appSv,contentSv,$sce) {

	$scope.contentSv= contentSv;

	$scope.setList = function() {

	}

	$scope.$watch("contentSv.getPageList('videos')",function(list){

		if (angular.isDefined(list.list)) {
			$scope.list = list.list.slice(0,$scope.limit);
			$scope.setList();
		}

	},true);

	$scope.getDescription = function(index) {

		return $sce.trustAsHtml(contentSv.getDescription($scope.list[index]));
	}

	$scope.getPlayer = function(index) {

		return $sce.trustAsHtml(contentSv.cleanSource(contentSv.getPlayer($scope.list[index])));
	}	

	$scope.getTitleStyle = function() {
		return {
			'background-color': $scope.config.custom.colors.contentBackground.value,
			'color': $scope.config.custom.colors.contentText.value
		}
	}

}