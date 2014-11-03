function adminSettingsCo($scope,appSv,userSv) {

	$scope.user		= userSv.getUser();

	$scope.profileImages= [];
	$scope.currentImage = 0;

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

	$scope.showDropzone = function() {
		document.querySelector(".profileImageContainer .dropzone").click();
	}

	$scope.$watch('userSv.getAccounts()', function(value) {
		if (angular.isDefined(value) && value.length > 0) {
			$scope.initProfileImages();
		}
	});

	$scope.$watch('currentImage', function(value) {
		$scope.currentImage = value;
		$scope.getProfileImageStyle();
	});

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

}