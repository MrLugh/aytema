function adminContentVideoCo($scope,$sce,contentSv) {

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

		var source = contentSv.getPlayer($scope.content);

		$scope.player		= source
		$scope.loadPlayer	= true;

		return $scope.player;
	}

	$scope.getThumbnail = function() {

		if ($scope.loadThumbnail) {
			return $scope.thumbnail;
		}		

		var source = contentSv.getThumbnail($scope.content);

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


function adminContentPhotoCo($scope,contentSv) {

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
				src 		: element.picture.replace(/_s./g,'_n.'),
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

function adminContentTrackCo($scope,$sce,contentSv) {

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

		var source = contentSv.getPlayer($scope.content);

		$scope.player		= source
		$scope.loadPlayer	= true;

		return $scope.player;
	}

	$scope.getThumbnail = function() {

		if ($scope.loadThumbnail) {
			return $scope.thumbnail;
		}

		var source = contentSv.getThumbnail($scope.content);

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

function adminContentPostCo($scope,contentSv,$sce) {

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
				return $sce.trustAsHtml($scope.content.data['embed']);
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

function adminContentChatCo($scope,contentSv) {

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

function adminContentQuoteCo($scope,contentSv) {

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