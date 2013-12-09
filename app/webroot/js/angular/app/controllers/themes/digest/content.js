function contentVideoCo($scope,$sce,contentSv) {

	//console.log($scope.content);

	$scope.player	= "";
	$scope.thumbnail= "";

	$scope.loadPlayer	= false;
	$scope.loadThumbnail= false;

	$scope.getPlayer = function() {

		if ($scope.loadPlayer) {
			return $sce.trustAsHtml(contentSv.cleanSource($scope.player));
			//return contentSv.cleanSource($scope.player);
		}

		var source = "";

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['player'])) {
				if (angular.isArray($scope.content.data['player'])) {
					source = $scope.content.data['player'][0]['embed_code'];
				}
			}
		}

		if ($scope.content.network == 'vimeo') {
			var id = $scope.content.external_id;
			source = '<iframe src="http://player.vimeo.com/video/'+id+'" width="250" height="188" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
		}

		if ($scope.content.network == 'facebook') {
			if (angular.isDefined($scope.content.data['source'])) {
				source = $scope.content.data['source'];
				source =  '<iframe src="'+source+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
			}
		}

		if ($scope.content.network == 'youtube') {
			source = '<iframe src="//www.youtube.com/embed/'+$scope.content.external_id+'" frameborder="0" allowfullscreen></iframe>';
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

		if ($scope.content.network == 'vimeo') {
			source = $scope.content.data.thumbnails.thumbnail[1]['_content'];
		}

		if ($scope.content.network == 'youtube') {
			source = $scope.content.data.thumbnail;
		}

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['thumbnail_url'])) {
				source = $scope.content.data['thumbnail_url'];
			}
		}

		$scope.thumbnail	= source;
		$scope.loadThumbnail= true;

		return $scope.thumbnail;
	}

	$scope.getTitle = function() {	

		if ($scope.content.network == 'tumblr') {

			if (angular.isDefined($scope.content.data['source_title'])) {
				return $scope.content.data['source_title'];
			}

			if (angular.isDefined($scope.content.data['slug'])) {
				//return $sce.trustAsHtml($scope.content.data['slug']);
				return $scope.content.data['slug'];
			}			
		}

		if ($scope.content.network == 'vimeo') {
			return $scope.content.data.title;
		}

		if ($scope.content.network == 'youtube') {
			return $scope.content.data['title'];
		}

		return '';
	}

	$scope.getDescription = function() {

		if ($scope.content.network == 'vimeo') {
			return $scope.content.data.description;
		}

		if ($scope.content.network == 'youtube') {
			return $scope.content.data['content'];
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

	$scope.$watch("content",function(value){
		//console.log("Watch video content ",value.id,$scope.content.id);
		$scope.player	= "";
		$scope.thumbnail= "";

		$scope.loadPlayer	= false;
		$scope.loadThumbnail= false;
	});	

}


function contentPhotoCo($scope,contentSv) {

	//console.log($scope.content);

	$scope.photolist	= [];
	$scope.current 		= {};
	$scope.currentPos	= 0;

	$scope.setCurrent = function() {
		$scope.current = $scope.photolist[$scope.currentPos];
	}

	$scope.setList = function() {

		if ($scope.content.network == 'tumblr') {
			for(x in $scope.content.data.photos) {
				var element = $scope.content.data.photos[x];
				var photo = {
					src 		: element.original_size.url,
					description : element.caption,
				};

				$scope.photolist.push(photo);
			}
		}

		if ($scope.content.network == 'facebook') {
			var element = $scope.content.data;
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

	$scope.moreThanOne = function() {
		return $scope.photolist.length > 1;
	}

	$scope.getTitle = function() {

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['source_title'])) {
				return $scope.content.data['source_title'];
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

		//console.log("content move");

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

	/*
	$scope.$watch("content",function(value){
		console.log("Watch photo content ",value.id,$scope.content.id);		
		$scope.photolist	= [];
		$scope.current 		= {};
		$scope.currentPos	= 0;
		$scope.setList();
		$scope.setCurrent();
	});
	*/
	$scope.setList();
	$scope.setCurrent();

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
			//return contentSv.cleanSource($scope.player);
		}

		var source = "";

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['embed'])) {
				source = $scope.content.data['embed'];
			}
			if (angular.isDefined($scope.content.data['player'])) {
				source = $scope.content.data['player'];
			}
		}

		if ($scope.content.network == 'soundcloud') {
			url = $scope.content.data['permalink_url'];
			source = '<iframe scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url='+url+'&show_artwork=true&auto_play=true&buying=false&download=true&legacy_fallback=false&liking=false&sharing=true&show_comments=true&show_playcount=true"></iframe>';
		}

		if ($scope.content.network == 'mixcloud') {
			if (angular.isDefined($scope.content.data['embed'])) {
				source = $scope.content.data['embed'];
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

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['thumbnail_url'])) {
				source = $scope.content.data['thumbnail_url'];
			}
			if (angular.isDefined($scope.content.data['album_art'])) {
				source = $scope.content.data['album_art'];
			}
		}

		if ($scope.content.network == 'soundcloud') {
			if (angular.isDefined($scope.content.data['artwork_url']) &&
				typeof $scope.content.data['artwork_url'] == 'string') {
				source = $scope.content.data['artwork_url'];
			}
		}

		if ($scope.content.network == 'mixcloud') {
			if (angular.isDefined($scope.content.data['pictures'])) {
				source = $scope.content.data['pictures']['medium'];
			}
		}

		$scope.thumbnail	= source;
		$scope.loadThumbnail= true;

		return $scope.thumbnail;
	}

	$scope.getTitle = function() {

		if ($scope.content.network == 'tumblr') {

			if (angular.isDefined($scope.content.data['source_title'])) {
				return $scope.content.data['source_title'];
			}

			if (angular.isDefined($scope.content.data['slug'])) {
				//return $sce.trustAsHtml($scope.content.data['slug']);
				return $scope.content.data['slug'];
			}			
		}

		if ($scope.content.network == 'soundcloud') {
			return $scope.content.data.title;
		}

		if ($scope.content.network == 'mixcloud') {
			return $scope.content.data.name;
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

	$scope.$watch("content",function(value){
		//console.log("Watch track content ",value.id,$scope.content.id);		
		$scope.player	= "";
		$scope.thumbnail= "";

		$scope.loadPlayer	= false;
		$scope.loadThumbnail= false;
	});	

}

function contentPostCo($scope,contentSv,$sce) {

	//console.log($scope.content);

	$scope.href	= '';

	$scope.isFromNetwork = function(network) {
		return $scope.content.network == network;
	}

	if ($scope.isFromNetwork('facebook')) {
		/*
		if (!angular.isDefined($scope.content['data']['story'])) {
			//console.log("A");
			if (angular.isDefined($scope.content['data']['link'])) {
				//console.log("B");
				$scope.href = $scope.content['data']['link'];
			} else {
				//console.log("C");
				$scope.href = "";
			}
		} else {
			*/
			$scope.href = "https://www.facebook.com/"+$scope.content['external_user_name']+"/posts/"+$scope.content['external_atomic_id'];
		/*			
		}
		*/
		//console.log($scope.href);
	}


	$scope.getEmbed = function() {

		if ($scope.content.network == 'twitter') {
			if (angular.isDefined($scope.content.data['embed'])) {
				//return $sce.trustAsHtml($scope.content.data['embed']);
				return $scope.content.data['embed'];
			}
		}		
	}

	$scope.getTitle = function() {

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['title'])) {
				return $scope.content.data['title'];
			}
		}

		return '';
	}

	$scope.getDescription = function() {	

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['body'])) {
				//return $sce.trustAsHtml($scope.content.data['body']);
				return $scope.content.data['body'];
			}
		}

		if ($scope.current.description.length) {
			return $scope.current.description;
		}

		return '';
	}

	$scope.$watch("content",function(value){
		//console.log("Watch post content ",value.id,$scope.content.id);		
	});

}

function contentChatCo($scope,contentSv) {

	//console.log($scope.content);

	$scope.getTitle = function() {

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['title'])) {
				return $scope.content.data['title'];
			}
		}

		return '';
	}

	$scope.getDialogues = function() {

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['dialogue'])) {
				return $scope.content.data['dialogue'];
			}
		}

		return '';
	}

	$scope.$watch("content",function(value){
		//console.log("Watch chat content ",value.id,$scope.content.id);		
	});	

}

function contentQuoteCo($scope,contentSv) {

	$scope.getQuoteText = function() {

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['text'])) {
				return $scope.content.data['text'];
			}
		}

		return '';
	}

	$scope.getQuoteSource = function() {

		if ($scope.content.network == 'tumblr') {
			if (angular.isDefined($scope.content.data['source'])) {
				return $scope.content.data['source'];
			}
		}

		return '';
	}

	$scope.$watch("content",function(value){
		//console.log("Watch quote content ",value.id,$scope.content.id);
	});	

}