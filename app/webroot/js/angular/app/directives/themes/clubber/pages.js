ayTemaDs.directive('photos',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/photos.html',
        restrict : 'E',
        replace : true,
        controller:'PhotosCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);


ayTemaDs.directive('videos',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/videos.html',
        restrict : 'E',
        replace : true,
        controller:'VideosCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);

ayTemaDs.directive('tracks',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/tracks.html',
        restrict : 'E',
        replace : true,
        controller:'TracksCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);

ayTemaDs.directive('posts',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/posts.html',
        restrict : 'E',
        replace : true,
        controller:'PostsCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);

ayTemaDs.directive('events',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/events.html',
        restrict : 'E',
        replace : true,
        controller:'EventsCo',
        scope: {
            limit:'=',
            config:'=',
        },
        link: function(scope,element,attrs) {

        }
    }

}]);