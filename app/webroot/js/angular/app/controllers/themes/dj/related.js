function relatedCo($scope,$sce,contentSv) {

    $scope.contentSv = contentSv;
    $scope.relateds  = [];

    $scope.loadRelatedContent = function() {

        if (!angular.isDefined($scope.content) || angular.equals($scope.content,{})) {
            return false;
        }

        var content = $scope.content;

        $scope.relateds     = [];

        var params = [];
        params['id']        = content.id;
        params['concept']   = content.concept;
        params['network']   = content.network;
        params['limit']     = 20;

        console.log(params);

        contentSv.getRelatedContent(params).then(
            function(data) {
                var contents = data.contents;
                if (data.contents.length) {
                    for (var x in contents) {
                        content = contents[x].Content;
                        $scope.relateds.push(content);
                    }
                    console.log($scope.relateds);
                }
            },
            function(reason) {
                //console.log('Failed: ', reason);
            },
            function(update) {
                //console.log('Got notification: ', update);
            }
        );

    }

	$scope.getRelatedThumbnail = function(index) {
		var content = $scope.relateds[index];
        var thumbnail = contentSv.getThumbnail(content);
		return thumbnail;
	}

    $scope.$watch('content',function(){
        console.log($scope.content);
        $scope.loadRelatedContent();
    },true);

    
}