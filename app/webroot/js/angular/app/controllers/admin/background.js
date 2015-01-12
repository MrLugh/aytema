function adminBackgroundCo($scope,userSv,appSv,contentSv) {

	$scope.showConfig 	= false;
	$scope.user 		= userSv.getUser();
	$scope.contentSv 	= contentSv;
	$scope.config		= $scope.$parent.config;

	$scope.newBg	= {name:'',img:''};

	$scope.dropzone = false; 

	$scope.saveConfig = function() {
		userSv.saveThemeConfig();
	}

	$scope.restoreConfig = function() {
		userSv.restoreConfig();
	}

	$scope.canAdd = function() {

		if ($scope.newBg.img.length>0 && $scope.newBg.name.length>0) {
			return true;
		}
		return false;
	}

	$scope.addBackground = function() {
		var bg = {};
		bg[$scope.newBg.name] = $scope.newBg.img;
		if (!angular.isDefined($scope.config.custom.background.list[bg])) {
			$scope.config.custom.background.list[$scope.newBg.name] = $scope.newBg.img;
			$scope.config.custom.background.selected = $scope.newBg.img;
		}
	}

	$scope.dropzoneConfig = {
		'options': { // passed into the Dropzone constructor
			'url': '/contents/addFile.json',
			'acceptedFiles': 'image/gif,image/jpeg,image/png',
		},
		'eventHandlers': {
			'success': function (file, response) {
				console.log(response.data);
				$scope.newBg.img = response.data.path;
				console.log($scope.newBg);
				$scope.dropzone.removeAllFiles(true);
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