function TracksCo($scope,appSv,contentSv,$sce) {

	$scope.contentSv= contentSv;
	$scope.tracklist= [];
	$scope.loading 	= false;
	$scope.limit 	= 10;
	$scope.offset 	= 0;
	$scope.show 	= false;
	$scope.player 	= false;
	$scope.content 	= false;

	$scope.setList = function() {

		$scope.list = contentSv.getPageList('tracks').list.slice($scope.offset,$scope.offset+$scope.limit);
		if ($scope.list.length == $scope.limit) {
			$scope.offset = $scope.offset + $scope.limit;
		} else {
			$scope.offset = $scope.offset + $scope.list.length;
		}

		for (var x in $scope.list) {

			var content = $scope.list[x];
			$scope.tracklist.push(content);
		}


		if ($scope.offset < contentSv.getPageList('tracks').list.length) {
			$scope.loading = false;
		}

	}

	$scope.$watch("contentSv.getPageList('tracks')",function(list){

		if (angular.isDefined(list.list)) {
			$scope.setList();
		}

	},true);

	$scope.getDescription = function(index) {

		return $sce.trustAsHtml(contentSv.getDescription($scope.tracklist[index]));
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
			'color': $scope.config.custom.colors.contentBackground.value
		}
	}

	$scope.getCommentsColor = function() {

		var color = $scope.config.custom.colors.background.value.replace("#","");

		if (contentSv.getContrast50(color) == 'white') {
			return "dark";
		}
		return "light";
	}

	$scope.showTrack = function(content) {
		$scope.show 	= false;
		$scope.current  = -1
		$scope.content  = {};
		$scope.contents = [];

		$scope.content 	= content;
		$scope.current 	= $scope.tracklist.indexOf($scope.content);
		$scope.contents	= [content];
		$scope.player 	= $sce.trustAsHtml(contentSv.getPlayer($scope.content));

		$scope.show   	= true;
	}

	$scope.move = function(direction) {

		var indexCurrent = $scope.tracklist.indexOf($scope.content);

		if (direction > 0) {
			indexCurrent++;
		} else {
			indexCurrent--;
		}

		if (indexCurrent == $scope.tracklist.length) {
			indexCurrent = 0;
		}
		if (indexCurrent < 0) {		
			indexCurrent = $scope.tracklist.length - 1;
		}

		$scope.showTrack($scope.tracklist[indexCurrent]);
	}

	$scope.close = function() {
		$scope.show   = false;
	}

	$scope.pageTracksWithplayerClass = function() {
		return ($scope.show) ? 'pageTracksWithplayer':'';
	}

	$scope.loadMore = function() {
		if ($scope.loading) {
			return false;
		}
		$scope.loading = true;
		if ($scope.offset + $scope.limit * 3 > contentSv.getPageList('tracks').list.length ) {
			$scope.$parent.$parent.getContent("tracks");
		}
		$scope.setList();
	}

    $scope.getContentCommentsHash = function() {
    	var c = $scope.content;
    	return "http://cloudcial.com/comments/"+c.network + '_' + c.external_user_id + '_' + c.concept + '_' + c.external_id;
    }	

}