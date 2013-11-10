function contentVideoCo($scope,$sce,contentSv) {

	$scope.player	= "";
	$scope.thumbnail= "";

	$scope.loadPlayer	= false;
	$scope.loadThumbnail= false;

	$scope.getScrollTop = function() {
		
	}

	$scope.getPlayer = function() {

		if ($scope.loadPlayer) {
			return $sce.trustAsHtml(contentSv.cleanSource($scope.player));
		}

		var source = "";

		if ($scope.content.Content.network == 'tumblr') {
			if (angular.isDefined($scope.content.Content.data['player'])) {
				if (angular.isArray($scope.content.Content.data['player'])) {
					source = $scope.content.Content.data['player'][0]['embed_code'];
				}
			}
		}

		if ($scope.content.Content.network == 'vimeo') {
			var id = $scope.content.Content.external_id;
			source = '<iframe src="http://player.vimeo.com/video/'+id+'" width="250" height="188" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
		}

		if ($scope.content.Content.network == 'facebook') {
			if (angular.isDefined($scope.content.Content.data['source'])) {
				source = $scope.content.Content.data['source'];
				source =  '<iframe src="'+source+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
			}
		}

		$scope.player		= source
		$scope.loadPlayer	= true;

		return $scope.player;
	}

	$scope.getThumbnail = function() {

		if ($scope.loadThumbnail) {
			return $scope.thumbnail;
		}		

		var source = "";

		if ($scope.content.Content.network == 'vimeo') {
			source = $scope.content.Content.data.thumbnails.thumbnail[1]['_content'];
		}

		if ($scope.content.Content.network == 'youtube') {
			source = $scope.content.Content.data.thumbnail;
		}

		if ($scope.content.Content.network == 'tumblr') {
			if (angular.isDefined($scope.content.Content.data['thumbnail_url'])) {
				source = $scope.content.Content.data['thumbnail_url'];
			}
		}

		$scope.thumbnail	= source;
		$scope.loadThumbnail= true;

		return $scope.thumbnail;
	}

	$scope.getTitle = function() {	

		if ($scope.content.Content.network == 'tumblr') {

			if (angular.isDefined($scope.content.Content.data['source_title'])) {
				return $scope.content.Content.data['source_title'];
			}

			if (angular.isDefined($scope.content.Content.data['slug'])) {
				return $sce.trustAsHtml($scope.content.Content.data['slug']);
			}			
		}

		if ($scope.content.Content.network == 'vimeo') {
			return $scope.content.Content.data.title;
		}

		if ($scope.content.Content.network == 'youtube') {
			return $scope.content.Content.data['title'];
		}

		return '';
	}

	$scope.getDescription = function() {

		if ($scope.content.Content.network == 'vimeo') {
			return $scope.content.Content.data.description;
		}

		if ($scope.content.Content.network == 'youtube') {
			return $scope.content.Content.data['content'];
		}

		return '';
	}

	$scope.hasThumbnail = function() {
		$scope.getThumbnail();
		return $scope.thumbnail.length > 0;
	}

	$scope.hasPlayer = function() {
		if ($scope.hasThumbnail()) {
			return false;
		}
		$scope.getPlayer();
		return $scope.player.length > 0;
	}

	$scope.canShowThumbnail = function() {
		return $scope.hasThumbnail();
	}

	$scope.canShowPlayer = function() {
		return !$scope.hasThumbnail() && $scope.hasPlayer();
	}

	$scope.isEmpty = function() {
		return !$scope.hasThumbnail() && !$scope.hasPlayer();
	}

}


function contentPhotoCo($scope,contentSv) {

	$scope.photolist	= [];
	$scope.current 		= {};
	$scope.currentPos	= 0;

	$scope.setCurrent = function() {
		$scope.current = $scope.photolist[$scope.currentPos];
	}

	$scope.setList = function() {

		if ($scope.content.Content.network == 'tumblr') {
			for(x in $scope.content.Content.data.photos) {
				var element = $scope.content.Content.data.photos[x];
				var photo = {
					src 		: element.original_size.url,
					description : element.caption,
				};

				$scope.photolist.push(photo);
			}
		}

		if ($scope.content.Content.network == 'facebook') {
			var element = $scope.content.Content.data;
			var caption = "";
			if (angular.isDefined(element.story)) {
				caption = element.story;
			}
			if (angular.isDefined(element.message)) {
				caption = element.message;
			}			

			var photo = {
				src 		: element.picture,
				description : caption,
			};

			$scope.photolist.push(photo);
		}

		return '';
	}
	$scope.setList();
	$scope.setCurrent();

	$scope.moreThanOne = function() {
		return $scope.photolist.length > 1;
	}

	$scope.getTitle = function() {

		if ($scope.content.Content.network == 'tumblr') {
			if (angular.isDefined($scope.content.Content.data['source_title'])) {
				return $scope.content.Content.data['source_title'];
			}
		}

		return '';
	}

	$scope.getDescription = function() {	

		if ($scope.current.description.length) {
			return $scope.current.description;
		}

		return '';
	}

	$scope.move = function(direction) {

		var currentPos = $scope.currentPos;

        if (direction > 0) {currentPos++;} else {currentPos--;}

        if (currentPos < 0 ) {
            currentPos = $scope.photolist.length - 1;
        }

        if (currentPos == $scope.photolist.length ) {
            currentPos = 0;
        }

        $scope.currentPos = currentPos;
	}

	$scope.$watch("currentPos",function(){
		$scope.setCurrent();
	});

}

function contentTrackCo($scope,$sce,contentSv) {

	//console.log($scope.content);

	$scope.player	= "";
	$scope.thumbnail= "";

	$scope.loadPlayer	= false;
	$scope.loadThumbnail= false;	

	$scope.getPlayer = function() {

		if ($scope.loadPlayer) {
			return $sce.trustAsHtml(contentSv.cleanSource($scope.player));
		}

		var source = "";

		if ($scope.content.Content.network == 'tumblr') {
			if (angular.isDefined($scope.content.Content.data['embed'])) {
				source = $scope.content.Content.data['embed'];
			}
			if (angular.isDefined($scope.content.Content.data['player'])) {
				source = $scope.content.Content.data['player'];
			}
		}

		if ($scope.content.Content.network == 'soundcloud') {
			url = $scope.content.Content.data['permalink_url'];
			source = '<iframe scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url='+url+'"></iframe>';
		}

		if ($scope.content.Content.network == 'mixcloud') {
			if (angular.isDefined($scope.content.Content.data['embed'])) {
				source = $scope.content.Content.data['embed'];
			}
		}

		$scope.player		= source
		$scope.loadPlayer	= true;

		return $scope.player;
	}

	$scope.getThumbnail = function() {

		if ($scope.loadThumbnail) {
			return $scope.thumbnail;
		}

		var source = "";

		if ($scope.content.Content.network == 'tumblr') {
			if (angular.isDefined($scope.content.Content.data['thumbnail_url'])) {
				source = $scope.content.Content.data['thumbnail_url'];
			}
			if (angular.isDefined($scope.content.Content.data['album_art'])) {
				source = $scope.content.Content.data['album_art'];
			}
		}

		if ($scope.content.Content.network == 'soundcloud') {
			if (angular.isDefined($scope.content.Content.data['artwork_url']) &&
				typeof $scope.content.Content.data['artwork_url'] == 'string') {
				source = $scope.content.Content.data['artwork_url'];
			}
		}

		if ($scope.content.Content.network == 'mixcloud') {
			if (angular.isDefined($scope.content.Content.data['pictures'])) {
				source = $scope.content.Content.data['pictures']['medium'];
			}
		}

		$scope.thumbnail	= source;
		$scope.loadThumbnail= true;

		return $scope.thumbnail;
	}

	$scope.getTitle = function() {

		if ($scope.content.Content.network == 'tumblr') {

			if (angular.isDefined($scope.content.Content.data['source_title'])) {
				return $scope.content.Content.data['source_title'];
			}

			if (angular.isDefined($scope.content.Content.data['slug'])) {
				return $sce.trustAsHtml($scope.content.Content.data['slug']);
			}			
		}

		if ($scope.content.Content.network == 'soundcloud') {
			return $scope.content.Content.data.title;
		}

		if ($scope.content.Content.network == 'mixcloud') {
			return $scope.content.Content.data.name;
		}


		return '';
	}

	$scope.getDescription = function() {	

		return '';
	}	

	$scope.hasThumbnail = function() {
		$scope.getThumbnail();
		return $scope.thumbnail.length > 0;
	}

	$scope.hasPlayer = function() {
		if ($scope.hasThumbnail()) {
			return false;
		}
		$scope.getPlayer();
		return $scope.player.length > 0;
	}

	$scope.canShowThumbnail = function() {
		return $scope.hasThumbnail();
	}

	$scope.canShowPlayer = function() {
		return !$scope.hasThumbnail() && $scope.hasPlayer();
	}

	$scope.isEmpty = function() {
		return !$scope.hasThumbnail() && !$scope.hasPlayer();
	}

}