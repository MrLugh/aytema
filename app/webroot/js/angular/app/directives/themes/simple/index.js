ayTemaDs.directive('themeSimple',['$window',
function($window){
    
    return {
        templateUrl : getPath('tpl')+'/themes/simple/index.html',
        restrict : 'E',
        replace : true,
        controller:'themeSimpleCo',
        scope: true,
        link: function(scope,element,attrs) {

            var scroll = function() {
                var bottom = $(window).height() + $(window).scrollTop();
                var height = $(document).height();

                var scrollPercent = Math.round(100*bottom/height);
                if(!scope.show && !scope.loading && scrollPercent > 99) {
                    scope.$apply(scope.moreContent());
                }
            }

            var destroy = function() {
                element.unbind('$destroy',destroy);
                angular.element($window).unbind('scroll',scroll);
            }

            angular.element($window).bind('scroll',scroll);
            element.bind('$destroy',destroy);

        }
    }

}]);

ayTemaDs.directive('content',[
function(){
    
    return {
        restrict : 'C',
        link: function(scope,element,attrs) {

            imagesLoaded(element[0],function(){
                var timer = setTimeout(function(){
                    clearTimeout(timer);
                    element.addClass('animated fadeInUp');
                },350);                
            });

        }
    }

}]);

ayTemaDs.directive('fbComments',['$FB','$timeout',
function($FB,$timeout){
    return {
        templateUrl : getPath('tpl')+'/themes/simple/comments.html',
        restrict : 'E',
        replace : true,
        link: function(scope,element,attrs) {

            scope.showComments = false;

            element.ready(function(){
                $timeout(function(){
                    scope.$FB = $FB;
                    scope.commentsUrl       = attrs.href;
                    scope.commentsNumposts  = attrs.dataNumposts || 5 ;
                    scope.commentsColor     = attrs.dataColorscheme || 'light';

                    scope.$watch('$FB.loaded',function(value) {
                        if(value){
                            if (typeof $FB  != "undefined"){
                                $FB.XFBML.parse($('.fb-comments .fb_iframe_widget').get(0));
                                $FB.XFBML.parse($('.fb-comments-count .fb_iframe_widget').get(0));                                
                            }
                        }
                    },true);

                    scope.$apply();
                },0);
            });

        } 
    }

}]);