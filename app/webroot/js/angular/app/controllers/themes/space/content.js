function contentVideoCo($scope,$sce,contentSv,userSv) {

	//console.log($scope.content);

	$scope.player	= "";
	$scope.thumbnail= "";

	$scope.loadPlayer	= false;
	$scope.loadThumbnail= false;

	$scope.isFromNetwork = function(network) {
		return $scope.content.network == network;
	}

	$scope.canEmbedFb = function() {
		return $scope.content.data.type != 'status';
	}

	$scope.getPlayer = function() {

		if ($scope.loadPlayer) {
			return $sce.trustAsHtml(contentSv.cleanSource($scope.player));
		}

		$scope.player		= contentSv.getPlayer($scope.content);
		$scope.loadPlayer	= true;

		return $scope.player;
	}

	$scope.getThumbnail = function() {

		if ($scope.loadThumbnail) {
			return $scope.thumbnail;
		}		

		$scope.thumbnail	= contentSv.getThumbnail($scope.content);
		$scope.loadThumbnail= true;

		return $scope.thumbnail;
	}

	$scope.getTitle = function() {	

		return contentSv.getTitle($scope.content);
	}

	$scope.getDescription = function() {

		return $sce.trustAsHtml(contentSv.getDescription($scope.content));
	}

    $scope.getDescriptionStyle = function() {

    	if (!angular.isDefined(userSv.getThemeConfig().custom)) {
    		return {};
    	}

		var rgb = contentSv.hexToRgb(userSv.getThemeConfig().custom.colors.background.value);
		var rgbString = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.9)";

    	return {
    		'background-color':rgbString,
			'color':userSv.getThemeConfig().custom.colors.contentText.value
		}

	}

	$scope.getControlsStyle = function() {
    	if (!angular.isDefined(userSv.getThemeConfig().custom)) {
    		return {};
    	}

		return {
			'color':userSv.getThemeConfig().custom.colors.contentText.value,
		};		
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

	$scope.getBgImage = function() {
		if (!$scope.hasThumbnail()) {
			return {}
		}

		return {
			'background-image':"url('"+$scope.getThumbnail()+"')"
		}
	}

	$scope.$watch("content",function(value){
		//console.log("Watch video content ",value.id,$scope.content.id);
		$scope.player	= "";
		$scope.thumbnail= "";

		$scope.loadPlayer	= false;
		$scope.loadThumbnail= false;
	});	

}


function contentPhotoCo($scope,contentSv,userSv) {

	//console.log($scope.content);

	$scope.photolist	= [];
	$scope.current 		= {};
	$scope.currentPos	= 0;

	$scope.isFromNetwork = function(network) {
		return $scope.content.network == network;
	}

	$scope.setCurrent = function() {
		$scope.current = $scope.photolist[$scope.currentPos];
	}

	$scope.setList = function() {

		if ($scope.content.network == 'tumblr') {
			for(x in $scope.content.data.photos) {
				var element = $scope.content.data.photos[x];
				var photo = {
					src 		: element.original_size.url,
					description : contentSv.getDescription($scope.content),
				};

				$scope.photolist.push(photo);
			}
		}

		if ($scope.content.network == 'facebook') {
			var element = $scope.content.data;
			var photo = {
				src 		: contentSv.getThumbnail($scope.content),
				description : contentSv.getDescription($scope.content),
			};

			$scope.photolist.push(photo);
		}

		return '';
	}

	$scope.moreThanOne = function() {
		return $scope.photolist.length > 1;
	}

	$scope.getTitle = function() {

		return contentSv.getTitle($scope.content);
	}

	$scope.getDescription = function() {	

		if ($scope.current.description.length) {
			return $scope.current.description;
		}

		return '';
	}

    $scope.getDescriptionStyle = function() {

    	if (!angular.isDefined(userSv.getThemeConfig().custom)) {
    		return {};
    	}

		var rgb = contentSv.hexToRgb(userSv.getThemeConfig().custom.colors.background.value);
		var rgbString = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.9)";

    	return {
    		'background-color':rgbString,
			'color':userSv.getThemeConfig().custom.colors.contentText.value
		}

	}

	$scope.getControlsStyle = function() {
    	if (!angular.isDefined(userSv.getThemeConfig().custom)) {
    		return {};
    	}

		return {
			'color':userSv.getThemeConfig().custom.colors.background.value,
		};		
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

	$scope.setList();
	$scope.setCurrent();

}

function contentTrackCo($scope,$sce,contentSv,userSv) {

	//console.log($scope.content);

	$scope.player	= "";
	$scope.thumbnail= "";

	$scope.loadPlayer	= false;
	$scope.loadThumbnail= false;

	$scope.isFromNetwork = function(network) {
		return $scope.content.network == network;
	}

	$scope.getPlayer = function() {

		if ($scope.loadPlayer) {
			return $sce.trustAsHtml(contentSv.cleanSource($scope.player));
			//return contentSv.cleanSource($scope.player);
		}

		$scope.player		= contentSv.getPlayer($scope.content);
		$scope.loadPlayer	= true;

		return $scope.player;
	}

	$scope.getThumbnail = function() {

		if ($scope.loadThumbnail) {
			return $scope.thumbnail;
		}

		$scope.thumbnail	= contentSv.getThumbnail($scope.content);
		$scope.loadThumbnail= true;

		return $scope.thumbnail;
	}

	$scope.getTitle = function() {

		return contentSv.getTitle($scope.content);
	}

	$scope.getDescription = function() {

		return $sce.trustAsHtml(contentSv.getDescription($scope.content));
	}	

    $scope.getDescriptionStyle = function() {

    	if (!angular.isDefined(userSv.getThemeConfig().custom)) {
    		return {};
    	}

		var rgb = contentSv.hexToRgb(userSv.getThemeConfig().custom.colors.background.value);
		var rgbString = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.9)";

    	return {
    		'background-color':rgbString,
			'color':userSv.getThemeConfig().custom.colors.contentText.value
		}

	}

	$scope.getControlsStyle = function() {
    	if (!angular.isDefined(userSv.getThemeConfig().custom)) {
    		return {};
    	}

		return {
			'color':userSv.getThemeConfig().custom.colors.contentText.value,
		};		
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

	$scope.getBgImage = function() {
		if (!$scope.hasThumbnail()) {
			return {}
		}

		return {
			'background-image':"url('"+$scope.getThumbnail()+"')"
		}
	}

	$scope.$watch("content",function(value){
		//console.log("Watch track content ",value.id,$scope.content.id);		
		$scope.player	= "";
		$scope.thumbnail= "";

		$scope.loadPlayer	= false;
		$scope.loadThumbnail= false;
	});	

}

function contentPostCo($scope,contentSv,$sce,userSv) {

	//console.log($scope.content);

	$scope.isFromNetwork = function(network) {
		return $scope.content.network == network;
	}

	$scope.getFbPostHref = function() {
		return contentSv.getFacebookContentHrefEmbed($scope.content);
	}

	$scope.canEmbedFb = function() {
		return $scope.content.data.type != 'status';
	}	

	$scope.getEmbed = function() {

		return $sce.trustAsHtml(contentSv.getEmbed($scope.content));
	}

	$scope.getTitle = function() {

		return contentSv.getTitle($scope.content);
	}

	$scope.getDescription = function() {

		return $sce.trustAsHtml(contentSv.getDescription($scope.content));
	}

    $scope.getDescriptionStyle = function() {

    	if (!angular.isDefined(userSv.getThemeConfig().custom)) {
    		return {};
    	}

		var rgb = contentSv.hexToRgb(userSv.getThemeConfig().custom.colors.background.value);
		var rgbString = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.9)";

    	return {
    		'background-color':rgbString,
			'color':userSv.getThemeConfig().custom.colors.contentText.value
		}

	}	

}

function contentChatCo($scope,contentSv) {

	//console.log($scope.content);

	$scope.getTitle = function() {

		return contentSv.getTitle($scope.content);
	}

	$scope.getDialogues = function() {

		return contentSv.getDialogues($scope.content);
	}

}

function contentQuoteCo($scope,contentSv) {

	$scope.getQuoteText = function() {

		return contentSv.getQuoteText($scope.content);
	}

	$scope.getQuoteSource = function() {

		return contentSv.getQuoteSource($scope.content);
	}

}

function contentLinkCo($scope,contentSv,$sce) {

	//console.log($scope.content);

	$scope.getUrl = function() {

		return contentSv.getUrl($scope.content);
	}

	$scope.getDescription = function() {

		return $sce.trustAsHtml(contentSv.getDescription($scope.content));
	}
}

function contentEventCo($scope,contentSv,$sce,userSv) {

	//console.log($scope.content);
	
    $scope.getDescriptionStyle = function() {

    	if (!angular.isDefined(userSv.getThemeConfig().custom)) {
    		return {};
    	}

		var rgb = contentSv.hexToRgb(userSv.getThemeConfig().custom.colors.background.value);
		var rgbString = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.9)";

    	return {
    		'background-color':rgbString,
			'color':userSv.getThemeConfig().custom.colors.contentText.value
		}

	}
	
	$scope.getMapSrc = function() {
		return "https://maps.googleapis.com/maps/api/staticmap?"+
		"sensor=false"+
		"&size=850x850"+
		"&markers="+encodeURI($scope.content.data.address)+
		"&client_id="+encodeURI("AIzaSyDgE0KcEAKdRQl9IReB4E7ZBZpQOL2Cxz8");
	}

}