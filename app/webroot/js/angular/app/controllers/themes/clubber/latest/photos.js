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
			}

			if (content.network == 'facebook') {
				var element = content.data;
				var photo = {
					src 		: element.picture.replace(/_s./g,'_n.'),
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
		return {
			'background-color': $scope.config.custom.colors.contentBackground.value,
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