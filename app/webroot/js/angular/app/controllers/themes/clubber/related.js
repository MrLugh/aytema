function relatedCo($scope,$sce,contentSv) {

    $scope.contentSv = contentSv;
    $scope.relateds  = [];
    $scope.defaultThumbnail = "http://cloudcial.com/img/themes/clubber/default-content-thumbnail.jpg";

    $scope.loadRelatedContent = function() {

        var content = $scope.content;

        $scope.relateds     = [];

        var params = [];
        params['id']        = content.id;
        params['network']   = content.network;
        params['concept']   = content.concept;
        //params['external_user_id'] = content.external_user_id;

        contentSv.getRelatedContent(params).then(
            function(data) {
                var contents = data.contents;
                if (data.contents.length) {
                    for (var x in contents) {
                        content = contents[x].Content;
                        $scope.relateds.push(content);
                    }
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
        if (thumbnail.length == 0) {
            thumbnail = $scope.defaultThumbnail;
        }
		return thumbnail;
	}

    $scope.loadRelatedContent();
}