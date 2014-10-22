function adminThemesCo($scope,appSv,userSv) {

	$scope.themes	= appSv.getThemes();
	$scope.user		= userSv.getUser();
	$scope.current  = -1;
	$scope.src 		= "";
	$scope.showPreview	= false;
	$scope.showFilters	= false;

	$scope.search 		= '';

	$scope.scrollCurrent = function() {

		var current = $scope.current;

		if ($scope.currentTimer) {
			clearTimeout($scope.currentTimer);
		}
		$scope.currentTimer = setTimeout(function(){
			clearTimeout($scope.currentTimer);
			element = angular.element(document.querySelector("#theme_"+current));

			if (angular.isDefined(element[0])) {
				$('html, body').animate({
					scrollTop: element[0].offsetTop
				}, 500);
			}
		},500);

	}

	$scope.manageFilters = function() {
		$scope.showFilters = !$scope.showFilters;
	}

	$scope.previewSrc = function(index) {
		$scope.current = index;
		$scope.src = "http://cloudcial.com/themes?type="+$scope.list[$scope.current].key+"&username="+$scope.user.username;
		$scope.showPreview = true;
		$scope.scrollToTop();
	}

	$scope.getContainerStyle = function() {
		return {'max-height':appSv.getHeight() + 'px'};
	}

	$scope.getPreviewStyle = function() {
		return {'height':appSv.getHeight()+'px'};
	}	

	$scope.getThemeClass = function(index) {
		return ($scope.current == index) ? 'theme themeActive' : 'theme';
	}

	$scope.matchBySearch = function(theme) {
		if ($scope.search.length == 0) {
			return true;
		}

		if (theme.key.search($scope.search) != -1) {
			return true;
		}

		return false;
	}

	$scope.setList = function() {

		var list= [];
		for (x in $scope.themes) {
			theme = $scope.themes[x];
			if ($scope.matchBySearch(theme)) {
				list.push(theme);
			}			
		}

		$scope.list = list;

	}
	$scope.setList();

	$scope.closePreview = function() {
		$scope.showPreview = false;
		$scope.src 		= "";
		$scope.scrollCurrent();
		$scope.current  = -1;
	}

	$scope.move = function(direction) {

		$scope.src = '';
		$scope.showPreview = false;

		if (direction > 0) {
			$scope.current++;
		} else {
			$scope.current--;		
		}

		if ($scope.current == $scope.list.length) {
			$scope.current = 0;
		}
		if ($scope.current < 0) {		
			$scope.current = $scope.list.length - 1;
		}
		$scope.previewSrc($scope.current);
	}

	$scope.getPreviousStyle = function() {

		var current = $scope.current;
		current--;
		if (current < 0) {
			current = $scope.list.length - 1;
		}		

		return {
			'background-image':'url('+$scope.list[current].thumbnails[0]+')',

		}
	}

	$scope.getThemeStyle = function() {
		return {'height':(appSv.getHeight() / 2 )+'px'}
	}

	$scope.getNextStyle = function() {

		var current = $scope.current;
		current++;
		if (current == $scope.list.length) {
			current = 0;
		}		

		return {
			'background-image':'url('+$scope.list[current].thumbnails[0]+')',
			
		}
	}

	$scope.getPreviousThemeName = function() {

		var current = $scope.current;
		current--;
		if (current < 0) {
			current = $scope.list.length - 1;
		}		

		return $scope.list[current].name;

	}

	$scope.getNextThemeName = function() {

		var current = $scope.current;
		current++;
		if (current == $scope.list.length) {
			current = 0;
		}		

		return $scope.list[current].name;
	}

	$scope.$watch('search',function(){
		$scope.setList();
	});

}