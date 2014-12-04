function themePhotographerCo($scope,appSv,userSv,contentSv,$sce,$interval) {

	$scope.appSv 	= appSv;
	$scope.contentSv= contentSv;
	$scope.userSv	= userSv;
	$scope.networks = appSv.getNetworks();
	delete $scope.networks['twitter'];

	userSv.search({search:userSv.getUser().username,limit:1}).then(function(data){
		$scope.user = data.users[0]['User'];
	});

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	$scope.limit 	= {
		'photo':8,
		'video':8,
	};
	$scope.contents	= {};
	$scope.loadingContent = {};
	$scope.photolist	= [];

	$scope.config		= {};
	$scope.configLoaded = false;
    $scope.showConfig = false;
	$scope.tabs = [
		{ title:"Background", key:"background", active: true },
	];

	$scope.current 	= false;
	$scope.content 	= {};
	$scope.isDetail = false;
	$scope.detailPhotoList = [];
	$scope.detailPhotoTimer = -1;
	$scope.detailPhotoCurrent = 0;

	userSv.loadThemeConfig('photographer');
	userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});

	$scope.isLogged = function() {
		return userSv.isLogged();
	};

	$scope.generatePagesList = function() {

		$scope.contents	= {};
		$scope.concepts = ['video','photo'];
	
		$scope.contents['video'] = {'offset':0,'list':[],'current':0};
		$scope.getContent('video');

		$scope.contents['photo'] = {'offset':0,'list':[],'current':0};
		$scope.getContent('photo');
	};

	$scope.getContent = function(concept) {

		if ($scope.loadingContent[concept]) {
			return false;
		}

		var params = [];

		$scope.loadingContent[concept] = true;

		var networks = [];
		var accounts = [];
		angular.forEach($scope.accounts, function(account,key) {

			if (angular.isDefined($scope.networks[account.Socialnet.network])) {

				if (networks.indexOf(account.Socialnet.network) == -1) {
					networks.push(account.Socialnet.network);
				}
				if (accounts.indexOf(account.Socialnet.id) == -1) {
					accounts.push(account.Socialnet.id);
				}

			}

		});

		params['concepts']	= [concept];
		params['networks']	= networks;
		params['offset']	= $scope.contents[concept].offset;
		params['limit']		= $scope.limit[concept];
		params['accounts']	= accounts;
		params['status']	= 'enabled';

		contentSv.getContentsByFilters(params).then(
			function(data) {
				var contents = data.contents;
				if (data.contents.length) {
					for (var x in contents) {
						content = contents[x].Content;
						$scope.contents[concept].list.push(content);
					}
					if (concept == 'photo') {
						$scope.setPhotoList();
					}
					$scope.contents[concept].offset = $scope.contents[concept].list.length;
					imagesLoaded($('body'),function(){
						var timeScroll = setTimeout(function(){
							clearTimeout(timeScroll);
							$scope.loadingContent[concept] = false;
							$scope.$broadcast('masonry.reload');
							/*
							var selector = "#"+$scope.getPluralizedConcepts(concept);
							if (angular.isDefined($(selector)[0])) {
								var list = document.querySelector(selector);
								$(list).animate({
									scrollTop: angular.element(list)[0].scrollHeight
								},5000);
							}
							*/
						},1500);
						
					});
					window.addEventListener( 'DOMContentLoaded', $scope.loadingContent[concept] = false, false);

				} else {
					$scope.loadingContent[concept] = true;
				}
			},
			function(reason) {
				//console.log('Failed: ', reason);
			},
			function(update) {
				//console.log('Got notification: ', update);
			}
		);

	};

	$scope.canAddPhoto = function(photo) {
		for (var x in $scope.photolist) {
			if ($scope.photolist[x].src == photo.src) {
				return false;
			}
		}
		return true;
	};

	$scope.setPhotoList = function() {

		angular.forEach($scope.contents.photo.list, function(content, index) {

			if (content.network == 'tumblr') {
				for(x in content.data.photos) {
					var element = content.data.photos[x];
					var photo = {
						src 	: element.original_size.url,
						title	: contentSv.getTitle(content),
						width 	: 200 +  200 * Math.random() << 0
					};

					if ($scope.canAddPhoto(photo)) {
						$scope.photolist.push(photo);
					}
					
				}
			} else {
				var element = content.data;
				var photo = {
					src 	: contentSv.getThumbnail(content),
					title	: contentSv.getTitle($scope.content),
					width 	: 200 +  200 * Math.random() << 0
				};

				if ($scope.canAddPhoto(photo)) {
					$scope.photolist.push(photo);
				}
			}
		});
	}

	$scope.setDetailPhotoList = function() {

		$scope.detailPhotoList = [];
		$interval.cancel($scope.detailPhotoTimer);

		if ($scope.content.network == 'tumblr') {
			for(x in $scope.content.data.photos) {
				var element = $scope.content.data.photos[x];
				var photo = {
					src 	: element.original_size.url,
					title	: contentSv.getTitle($scope.content),
					width 	: 200 +  200 * Math.random() << 0
				};

				$scope.detailPhotoList.push(photo);
				
			}
		} else {
			var element = $scope.content.data;
			var photo = {
				src 	: contentSv.getThumbnail($scope.content),
				title	: contentSv.getTitle($scope.content),
				width 	: 200 +  200 * Math.random() << 0
			};

			$scope.detailPhotoList.push(photo);
		}

		$scope.detailPhotoCurrent = 0;
		if ($scope.detailPhotoList.length > 1) {
			$scope.detailPhotoTimer = $interval(function(){
				$scope.moveDetailPhotoCurrent();
			},5000);	
		}

	}

	$scope.getPluralizedConcepts = function(concept) {
		return appSv.getPluralizedConcepts()[concept];
	};

	$scope.getPlayer = function(content) {
		return $sce.trustAsHtml(contentSv.getPlayer(content));
		return $sce.trustAsHtml(contentSv.cleanSource(contentSv.getPlayer(content)));
	};

	$scope.getDescription = function(content) {

		return $sce.trustAsHtml(contentSv.getDescription(content));
	};

	$scope.getBiography = function() {

		return $sce.trustAsHtml($scope.user.biography);
	};

	$scope.getMapSrc = function() {
		return "https://maps.googleapis.com/maps/api/staticmap?"+
		"sensor=false"+
		"&size=850x850"+
		"&markers="+encodeURI($scope.user.address)+
		"&client_id="+encodeURI("AIzaSyDgE0KcEAKdRQl9IReB4E7ZBZpQOL2Cxz8");
	}

	$scope.$watch("userSv.getAccounts()",function(accounts){

		if (accounts.length > 0) {
			$scope.accounts = accounts;
			$scope.accountsLoaded = true;
		}

		if ($scope.accountsLoaded) {
			$scope.generatePagesList();
		}
	},true);

	$scope.$watch("userSv.getThemeConfig()",function(configNew,configOld){

		if (!angular.equals(configNew, configOld)) {
			$scope.config = configNew;
			$scope.configLoaded = true;
		}
	},true);

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
    });

	$scope.resetIframes = function(index) {

	    angular.forEach(document.querySelectorAll("iframe"), function(iframe, index) {
	    	iframe.src = iframe.src;
	    });
	};

	$scope.networkIcon = function(network) {
		return contentSv.getNetworkIcon(network);
	};

    $scope.getContentCommentsHash = function() {
    	var c = $scope.content;
    	return "http://cloudcial.com/comments/"+c.network + '_' + c.external_user_id + '_' + c.concept + '_' + c.external_id;
    };	

    $scope.adminTheme = function() {
    	$scope.showConfig = !$scope.showConfig;
    };

    $scope.getConfigStyle = function() {
	   	if ($scope.showConfig == true) {
	   		return {'right':'0'};
    	}
	   	return {'right':'0'};
    };

    $scope.getConfigButtonStyle = function() {
	   	if ($scope.showConfig == true) {
	   		return {'right':'100%'};
    	}
	   	return {'right':'0'};
    };

    $scope.manageCurrent = function(current) {

    	$scope.closeDetail();

    	if ($scope.current == current) {
    		$scope.current = false;
    		return false;
    	}
    	$scope.current = current;

    };

    $scope.showDetail = function(content) {
    	$scope.isDetail = true;
    	$scope.content = content;
    	$scope.detaillist = [content];
    	$scope.setDetailPhotoList();
    };

    $scope.closeDetail = function() {
    	$scope.isDetail = false;
    	$scope.content = {};
    	$scope.detaillist = [];
    	$interval.cancel($scope.detailPhotoTimer);
		$scope.detailPhotoList = [];
		$scope.detailPhotoTimer = -1;
		$scope.detailPhotoCurrent = 0;
    };

    $scope.moveDetail = function(direction) {

    	var type = $scope.content.concept;

		var currentPos = $scope.contents[type].list.indexOf($scope.content);

        if (direction > 0) {currentPos++;} else {currentPos--;}

        if (currentPos < 0 ) {
            currentPos = $scope.contents[type].list.length - 1;
        }

        if (currentPos == $scope.contents[type].list.length ) {
            currentPos = 0;
        }

        $scope.showDetail($scope.contents[type].list[currentPos]);

    };

    $scope.moveDetailPhotoCurrent = function() {

    	if ($scope.detailPhotoList.length == 1) {
    		return;
    	}

		var currentPos = $scope.detailPhotoCurrent;

        currentPos++;

        if (currentPos < 0 ) {
            currentPos = $scope.detailPhotoList.length - 1;
        }

        if (currentPos == $scope.detailPhotoList.length ) {
            currentPos = 0;
        }

        $scope.detailPhotoCurrent = currentPos;

    };    

$scope.detailPhotoCurrent    

    $scope.photosizes = [
    	'half','xlarge','xlarge',
    	'large','large','small','small','medium',

    	'xlarge','xlarge','half',
    	'xlarge','small','small','small','small',

    	'xlarge','medium','medium',
    	'full','xlarge','medium','small','small'
    ];

    $scope.getPhotoClass = function(index) {
    	var x = index % $scope.photosizes.length;
     	return angular.copy($scope.photosizes)[x];
    }

    $scope.videosizes = [
    	'xlarge','xlarge','half',
    	'xlarge','small','small','small','small',

    	'xlarge','medium','medium',
    	'full','xlarge','medium','small','small'
    ];



    $scope.getVideoClass = function(index) {
    	var x = index % $scope.videosizes.length;
     	return angular.copy($scope.videosizes)[x];
    }


}