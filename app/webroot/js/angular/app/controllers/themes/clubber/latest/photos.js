function latestPhotosCo($scope,appSv,contentSv,$sce) {

	$scope.contentSv= contentSv;
	$scope.photolist = [];

	$scope.setList = function() {

		$scope.photolist = [];

		for (var x in $scope.list) {

			var content = $scope.list[x];

			if (content.network == 'tumblr') {
				var element = content.data.photos[0];
				var photo = {
					src 		: element.original_size.url,
					title		: contentSv.getTitle(content)
				};

				$scope.photolist.push(photo);
			} else {
				var element = content.data;
				var photo = {
					src 		: contentSv.getThumbnail(content),
					title		: contentSv.getTitle(content)
				};

				$scope.photolist.push(photo);				
			}

		}

	}


	$scope.$watch("contentSv.getPageList('photos')",function(list){

		if (angular.isDefined(list.list)) {
			$scope.list = list.list.slice(0,$scope.limit);
			$scope.setList();
		}

	},true);


	$scope.getDescription = function(index) {

		return $sce.trustAsHtml(contentSv.getDescription($scope.list[index]));
	}

	$scope.getTitleStyle = function() {
		var rgb = contentSv.hexToRgb($scope.config.custom.colors.contentBackground.value);
		var rgbString = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.2)";
		return {
			'background-color': rgbString,
			'color': $scope.config.custom.colors.contentText.value
		}
	}

	$scope.getDescriptionStyle = function() {

		var color = $scope.config.custom.colors.background.value.replace("#","");

		var contrast = "#000000";
		if (contentSv.getContrast50(color) == 'white') {
			contrast = "#ffffff";
		}

		return {
			'background-color': $scope.config.custom.colors.background.value,
			'color': contrast
		}
	}

}