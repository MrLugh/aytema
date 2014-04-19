ayTemaDs.directive('photos',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/photos.html',
        restrict : 'E',
        replace : true,
        controller:'PhotosCo',
        link: function(scope,element,attrs) {

            $(window).scroll(function() {

                if ( !scope.loading && ($(window).scrollTop() + $(window).height()) >= ($('body').height() * 0.9)) {
                    //scope.$apply(scope.loadMore());
                }

            });

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
        link: function(scope,element,attrs) {

        }
    }

}]);