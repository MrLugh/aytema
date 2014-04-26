function VideosCo($scope,appSv,contentSv,$sce) {

	$scope.contentSv= contentSv;
	$scope.videolist= [];
	$scope.loading 	= false;
	$scope.limit 	= 10;
	$scope.offset 	= 0;
	$scope.show 	= false;
	$scope.player 	= false;
	$scope.content 	= false;

	$scope.setList = function() {

		$scope.list = contentSv.getPageList('videos').list.slice($scope.offset,$scope.offset+$scope.limit);
		if ($scope.list.length == $scope.limit) {
			$scope.offset = $scope.offset + $scope.limit;
		} else {
			$scope.offset = $scope.offset + $scope.list.length;
		}

		for (var x in $scope.list) {

			var content = $scope.list[x];
			$scope.videolist.push(content);
		}

		if ($scope.offset < contentSv.getPageList('videos').list.length) {
			$scope.loading = false;
		}

	}

	$scope.$watch("contentSv.getPageList('videos')",function(list){

		if (angular.isDefined(list.list)) {
			$scope.setList();
		}

	},true);

	$scope.getDescription = function(index) {

		return $sce.trustAsHtml(contentSv.getDescription($scope.videolist[index]));
	}

	$scope.getTitleStyle = function() {
		return {
			'background-color': $scope.config.custom.colors.contentBackground.value,
			'color': $scope.config.custom.colors.contentText.value
		}
	}

	$scope.getPlayerStyle = function() {
		return {
			'background-color': $scope.config.custom.colors.background.value,
			'color': $scope.config.custom.colors.contentText.value
		}
	}

	$scope.showVideo = function(content) {
		$scope.current= $scope.videolist.indexOf($scope.content);
		$scope.content= content;
		$scope.player = $sce.trustAsHtml(contentSv.getPlayer($scope.content));
		$scope.show   = true;
	}

	$scope.move = function(direction) {

		var indexCurrent = $scope.videolist.indexOf($scope.content);

		if (direction > 0) {
			indexCurrent++;
		} else {
			indexCurrent--;
		}

		if (indexCurrent == $scope.videolist.length) {
			indexCurrent = 0;
		}
		if (indexCurrent < 0) {		
			indexCurrent = $scope.videolist.length - 1;
		}

		$scope.showVideo($scope.videolist[indexCurrent]);
	}

	$scope.close = function() {
		$scope.show   = false;
	}

	$scope.pageVideosWithplayerClass = function() {
		return ($scope.show) ? 'pageVideosWithplayer':'';
	}

	$scope.loadMore = function() {
		if ($scope.loading) {
			return false;
		}
		$scope.loading = true;
		if ($scope.offset + $scope.limit * 3 > contentSv.getPageList('videos').list.length ) {
			$scope.$parent.$parent.getContent("videos");
		}
		$scope.setList();
	}

}