ayTemaDs.directive('latestPhotos',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/latest/photos.html',
        restrict : 'E',
        replace : true,
        controller:'latestPhotosCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);


ayTemaDs.directive('latestVideos',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/latest/videos.html',
        restrict : 'E',
        replace : true,
        controller:'latestVideosCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);

ayTemaDs.directive('latestTracks',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/latest/tracks.html',
        restrict : 'E',
        replace : true,
        controller:'latestTracksCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);

ayTemaDs.directive('latestPosts',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/latest/posts.html',
        restrict : 'E',
        replace : true,
        controller:'latestPostsCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);

ayTemaDs.directive('latestEvents',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/latest/events.html',
        restrict : 'E',
        replace : true,
        controller:'latestEventsCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);