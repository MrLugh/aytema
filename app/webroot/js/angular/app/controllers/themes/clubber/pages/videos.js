function VideosCo($scope,appSv,contentSv,$sce) {

	$scope.contentSv= contentSv;
	$scope.videolist= [];
	$scope.loading 	= false;
	$scope.limit 	= 8;
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

	$scope.showVideo = function(content) {
		$scope.show 	= false;
		$scope.current  = -1
		$scope.content  = {};
		$scope.contents = [];

		$scope.content 	= content;
		$scope.current 	= $scope.videolist.indexOf($scope.content);
		$scope.contents	= [content];
		$scope.player 	= $sce.trustAsHtml(contentSv.getPlayer($scope.content));

		$scope.show 	= true;
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
		$scope.scrollCurrent();
	}

	$scope.scrollCurrent = function() {

		element = angular.element(document.querySelector("#page_videos_"+$scope.current));

		if (angular.isDefined(element[0])) {
			angular.element(document).ready(function(){

				var bg 	= angular.element(document.querySelector("#page_videos_"+$scope.current));

				$('html, body').animate({
					scrollTop: element[0].offsetTop
				}, 500);

			});
		}

	}

	$scope.pageVideosWithplayerClass = function() {
		return ($scope.show) ? 'pageVideosWithplayer':'';
	}

	$scope.loadMore = function() {
		$scope.$parent.$parent.getContent("videos");
		$scope.setList();
	}

    $scope.getContentCommentsHash = function() {
    	var c = $scope.content;
    	return "http://cloudcial.com/comments/"+c.network + '_' + c.external_user_id + '_' + c.concept + '_' + c.external_id;
    }

}