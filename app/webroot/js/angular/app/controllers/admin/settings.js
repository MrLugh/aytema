function adminSettingsCo($scope,$sce,appSv,userSv) {

	$scope.profileImages= [];
	$scope.currentImage = 0;

	$scope.informationError = {};

	$scope.biography 	= "<p><strong>Biography</strong> test</p>";

	userSv.search({search:userSv.getUser().username,limit:1}).then(function(data){
		userSv.setUser(data.users[0]['User']);
	});

	$scope.initProfileImages = function() {

		$scope.profileImages = [];
		$scope.currentImage  = 0;

		for (var x in userSv.getAccounts()) {
			var account = userSv.getAccounts()[x];
			if ($scope.profileImages.indexOf(account.Socialnet.profile_image) == -1) {
				$scope.profileImages.push(account.Socialnet.profile_image);
			}
		}

		if ($scope.profileImages.indexOf($scope.user.profile_image) != -1) {
			$scope.currentImage	= $scope.profileImages.indexOf($scope.user.profile_image);
		} else if ( angular.isDefined(($scope.user.profile_image)) && $scope.user.profile_image.length>0) {
			$scope.profileImages.push($scope.user.profile_image);
			$scope.currentImage	= $scope.profileImages.indexOf($scope.user.profile_image);
		}

	}

	$scope.getProfileImageStyle = function() {
		if (angular.isDefined($scope.profileImages[$scope.currentImage])) {
			return {'background-image':'url("'+$scope.profileImages[$scope.currentImage]+'")'}
		}
		return {}
	}

	$scope.moveProfileImage = function(direction) {

		if (direction > 0) {
			$scope.currentImage++;
		} else {
			$scope.currentImage--;		
		}

		if ($scope.currentImage == $scope.profileImages.length) {
			$scope.currentImage = 0;
		}
		if ($scope.currentImage < 0) {		
			$scope.currentImage = $scope.profileImages.length - 1;
		}
	}

	$scope.saveProfileImage = function() {
		userSv.saveProfileimage($scope.profileImages[$scope.currentImage]);
	}

	$scope.saveInformation = function() {
		userSv.saveInformation($scope.user).then(
			function(data){
				$scope.informationError = {};
			},
			function(data) {
				$scope.informationError = data.error[0];
			}
		);
	}

	$scope.hasInformationError = function() {
		return !angular.equals($scope.informationError,{});
	}

	$scope.getInformationError = function() {

		var html = "<ul>";
		angular.forEach($scope.informationError, function(value,key) {
			for (var x in value) {
				html+="<li>"+value[x]+"</li>";
			}
		});
		html+="</ul>";
		return $sce.trustAsHtml(html);
	}

	$scope.showDropzone = function() {
		document.querySelector(".profileImageContainer .dropzone").click();
	}

	$scope.$watch('userSv.getAccounts()', function(value) {
		if (angular.isDefined(value) && value.length > 0) {
			$scope.initProfileImages();
		}
	});

	$scope.saveBiography = function() {
		userSv.saveInformation({biography:$scope.user.biography});
	}

	$scope.saveAddress = function() {
		userSv.saveInformation({address:$scope.user.address});
	}	

	$scope.$watch('currentImage', function(value) {
		$scope.currentImage = value;
		$scope.getProfileImageStyle();
	});

	$scope.$watch('userSv.getUser()',function(user){
		$scope.user = angular.copy(user);
	},true);

	$scope.dropzoneConfig = {
		'options': { // passed into the Dropzone constructor
			'url': '/contents/addFile.json',
			'acceptedFiles': 'image/gif,image/jpeg,image/png',
		},
		'eventHandlers': {
			'success': function (file, response) {
				$scope.$apply(function(){
					$scope.profileImages.push(response.data.path);
					$scope.currentImage = $scope.profileImages.length -1;
					$scope.dropzoneProfile.removeAllFiles(true);
				});
			},
			'error': function (file, response) {
				console.log("error");
				console.log(response);
			},
		}
	};

	$scope.dropzoneConfig.options.maxFiles = 1;	
	$scope.dropzoneConfig.options.init = function() {
		this.on("maxfilesexceeded", function(file){
			$scope.alert = "Just one file please!";
		});
	}

	$scope.tinymceOptions = {
    	selector : ".tinymce",
	    theme: "modern",
	    height:230,
	    width:'100%',
	    plugins: [
	        ["advlist autolink link image lists charmap preview hr anchor pagebreak"],
	        ["searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime nonbreaking"],
	        ["save table contextmenu directionality emoticons template paste "]
	    ],
	    toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link  | preview",
	    relative_urls:false,
        file_browser_callback: function(field_name, url, type, win) {
        	console.log(field_name);
        	console.log(url);
        	console.log(type);
        	console.log(win);
        },
        handle_event_callback: function (e) {
        // put logic here for keypress
        }
    };

	$scope.getMapSrc = function() {
		return "https://maps.googleapis.com/maps/api/staticmap?"+
		"sensor=false"+
		"&size=850x850"+
		"&markers="+encodeURI($scope.address)+
		"&client_id="+encodeURI("AIzaSyDgE0KcEAKdRQl9IReB4E7ZBZpQOL2Cxz8");
	}

}