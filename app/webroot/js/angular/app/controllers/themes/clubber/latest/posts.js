function latestPostsCo($scope,appSv,contentSv,$sce) {

	$scope.contentSv= contentSv;

	$scope.setList = function() {

	}

	$scope.$watch("contentSv.getPageList('posts')",function(list){

		if (angular.isDefined(list.list)) {
			$scope.list = list.list.slice(0,$scope.limit);
			$scope.setList();
		}

	},true);	

	$scope.getDescription = function(index) {

		return $sce.trustAsHtml(contentSv.getDescription($scope.list[index]));
	}

}