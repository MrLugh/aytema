function themeDigestCo($scope,appSv,userSv,contentSv) {

	$scope.contentSv = contentSv;

	$scope.user = userSv.getUser();

	$scope.list 	= [];

	$scope.scroll   = 0;

	$scope.setList = function(contents) {

		for (x in contents) {
			var content = contents[x];
			var index 	= $scope.list.indexOf(content);

			if( index == -1) {
				$scope.list.push(content);
			} else if (!angular.equals($scope.list[index], content)) {
				$scope.list[index] = content;
			}
		}
	}

	$scope.isLogged = function() {
		return userSv.isLogged();
	}

	$scope.canShowStat = function(stat) {
		return (parseInt(stat) != 0) ? true : false;
	}

	$scope.statIcon = function(stat_name) {
		return contentSv.getStatIcon(stat_name);
	}

	$scope.moreContent = function() {
		contentSv.loadContent();
	}

	$scope.getStyle = function() {
		return {'min-height':appSv.getHeight()+ 'px'};
	}

	$scope.$watch("contentSv.getDicContent()",function(contents){
		$scope.setList(contents);
	},true);

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
        $scope.getStyle();	
    });

	contentSv.loadContent();
}