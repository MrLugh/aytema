function adminContentVideoCo($scope,$sce,contentSv) {

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
		} else {
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

function adminContentTrackCo($scope,$sce,contentSv) {

	console.log($scope.content);

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

	$scope.isFromNetwork = function(network) {
		return $scope.content.network == network;
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

	$scope.getThumbnail = function() {

		if ($scope.loadThumbnail) {
			return $scope.thumbnail;
		}

		$scope.thumbnail	= contentSv.getThumbnail($scope.content);
		$scope.loadThumbnail= true;

		return $scope.thumbnail;
	}

	$scope.hasThumbnail = function() {
		$scope.getThumbnail();
		return $scope.thumbnail.length > 0;
	}

	$scope.canShowThumbnail = function() {
		return $scope.hasThumbnail();
	}

}

function adminContentChatCo($scope,contentSv) {

	//console.log($scope.content);

	$scope.getTitle = function() {

		return contentSv.getTitle($scope.content);
	}

	$scope.getDialogues = function() {

		return contentSv.getDialogues($scope.content);
	}

}

function adminContentQuoteCo($scope,contentSv) {

	$scope.getQuoteText = function() {

		return contentSv.getQuoteText($scope.content);
	}

	$scope.getQuoteSource = function() {

		return contentSv.getQuoteSource($scope.content);
	}

}

function adminContentLinkCo($scope,contentSv,$sce) {

	//console.log($scope.content);

	$scope.getUrl = function() {

		return contentSv.getUrl($scope.content);
	}

	$scope.getDescription = function() {

		return $sce.trustAsHtml(contentSv.getDescription($scope.content));
	}
}

function adminContentEventCo($scope,contentSv,$sce) {

	$scope.getMapSrc = function() {
		return "https://maps.googleapis.com/maps/api/staticmap?"+
		"sensor=false"+
		"&size=850x850"+
		"&markers="+encodeURI($scope.content.data.address)+
		"&client_id="+encodeURI("AIzaSyDgE0KcEAKdRQl9IReB4E7ZBZpQOL2Cxz8");
	}

}

function adminAddEventCo($scope,contentSv,userSv,$sce) {

	$scope.datePicker = false;

	$scope.user = userSv.getUser();

	$scope.event = {
		'name'		: '',
		'address'	: '',
		'date'		: new Date(),
		'time'		: '',
		'door'		: '',
		'place'		: '',
		'ticket'	: ''
	}

  	$scope.dateOptions = {
  		'year-format'	: "'yyyy'",
  		'starting-day'	: 1,
  		'default'		: 'today'
  	};

	$scope.getMapSrc = function() {
		return "https://maps.googleapis.com/maps/api/staticmap?"+
		"sensor=false"+
		"&size=850x850"+
		"&markers="+encodeURI($scope.event.address)+
		"&client_id="+encodeURI("AIzaSyDgE0KcEAKdRQl9IReB4E7ZBZpQOL2Cxz8");
	}

	$scope.openDatePicker = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker = true;
	};

	$scope.disabledWeek = function(date, mode) {
		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	};

	$scope.save = function() {

		$scope.event.date = $scope.format(new Date($scope.event.date));

		var event = {
			'network'			: 'cloudcial',
			'concept'			: 'event',
			'data'				: $scope.event
		}

		contentSv.createContent(event).then(function(data){
			$scope.event = {
				'name'		: '',
				'address'	: '',
				'date'		: new Date(),
				'time'		: '',
				'door'		: '',
				'place'		: '',
				'ticket'	: ''
			}			
		});
	}

	$scope.format =  function(date) {
		var year = date.getFullYear();
		var month = (1 + date.getMonth()).toString();
		month = month.length > 1 ? month : '0' + month;
		var day = date.getDate().toString();
		day = day.length > 1 ? day : '0' + day;
		return year + '-' + month + '-' + day;
	}

}

function adminAddPhotoCo($scope,contentSv,userSv,$sce) {

	$scope.dropzoneConfig = {
		'options': { // passed into the Dropzone constructor
			'url': '/contents/addFile.json',
			'acceptedFiles': 'image/gif,image/jpeg,image/png'
		},
		'eventHandlers': {
			'success': function (file, response) {
				var data = response.data;
				data.title 		= '';
				data.description= '';
				var content = {
					'network'			: 'cloudcial',
					'concept'			: 'photo',
					'data'				: response.data
				}
				contentSv.createContent(content);
			},
			'error': function (file, response) {
				console.log("error");
				console.log(response);
			},
		}
	};

}

function adminAddTrackCo($scope,contentSv,userSv,$sce) {

	$scope.dropzoneConfig = {
		'options': { // passed into the Dropzone constructor
			'url': '/contents/addFile.json',
			'acceptedFiles': 'audio/mpeg,audio/mp3,audio/mp4,audio/ogg,audio/wav,audio/webm,audio/aac'
		},
		'eventHandlers': {
			'success': function (file, response) {
				var data = response.data;
				data.title 		= '';
				data.description= '';
				var content = {
					'network'			: 'cloudcial',
					'concept'			: 'track',
					'data'				: response.data
				}
				contentSv.createContent(content);
			},
			'error': function (file, response) {
				console.log("error");
				console.log(file);
				console.log(response);
			},
		}
	};

}

function adminAddVideoCo($scope,contentSv,userSv,$sce) {

	$scope.dropzoneConfig = {
		'options': { // passed into the Dropzone constructor
			'url': '/contents/addFile.json',
			'acceptedFiles': "video/mp4,video/m4v,video/ogg,video/ogv,video/webm",
			//'maxFilesize' : 100
		},
		'eventHandlers': {
			'success': function (file, response) {
				var data = response.data;
				data.title 		= '';
				data.description= '';
				var content = {
					'network'			: 'cloudcial',
					'concept'			: 'video',
					'data'				: response.data
				}
				contentSv.createContent(content);
			},
			'error': function (file, response) {
				console.log("error");
				console.log(file);
				console.log(response);
			},
		}
	};

}