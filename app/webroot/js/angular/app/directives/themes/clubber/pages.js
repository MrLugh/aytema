ayTemaDs.directive('photos',['$window',
function ($window) {
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/photos.html',
        restrict : 'E',
        replace : true,
        controller:'PhotosCo',
        link: function(scope,element,attrs) {

            scope.scrollToTop = function() {
                $('body').animate({scrollTop: $('body').offset().top}, "slow");
            }            

            scope.$watch('show',function(){
                if (scope.show) {
                    scope.scrollToTop();
                }
            });

            var scroll = function() {
                var bottom = $(window).height() + $(window).scrollTop();
                var height = $(document).height();

                var scrollPercent = Math.round(100*bottom/height);
                if(!scope.show && !scope.loading && scrollPercent > 95) {
                    scope.$apply(scope.loadMore());
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


ayTemaDs.directive('videos',['$window',
function ($window) {
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/videos.html',
        restrict : 'E',
        replace : true,
        controller:'VideosCo',
        link: function(scope,element,attrs) {

            scope.scrollToTop = function() {
                $('body').animate({scrollTop: $('body').offset().top}, "slow");
            }            

            scope.$watch('show',function(){
                if (scope.show) {
                    scope.scrollToTop();
                }
            });

            var scroll = function() {
                var bottom = $(window).height() + $(window).scrollTop();
                var height = $(document).height();

                var scrollPercent = Math.round(100*bottom/height);
                if(!scope.show && !scope.loading && scrollPercent > 95) {
                    scope.$apply(scope.loadMore());
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

ayTemaDs.directive('tracks',['$window',
function ($window) {
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/tracks.html',
        restrict : 'E',
        replace : true,
        controller:'TracksCo',
        link: function(scope,element,attrs) {

            scope.scrollToTop = function() {
                $('body').animate({scrollTop: $('body').offset().top}, "slow");
            }            

            scope.$watch('show',function(){
                if (scope.show) {
                    scope.scrollToTop();
                }
            });

            var scroll = function() {
                var bottom = $(window).height() + $(window).scrollTop();
                var height = $(document).height();

                var scrollPercent = Math.round(100*bottom/height);
                if(!scope.show && !scope.loading && scrollPercent > 95) {
                    scope.$apply(scope.loadMore());
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

ayTemaDs.directive('posts',['$window',
function ($window) {
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/posts.html',
        restrict : 'E',
        replace : true,
        controller:'PostsCo',
        link: function(scope,element,attrs) {

            var scroll = function() {
                var bottom = $(window).height() + $(window).scrollTop();
                var height = $(document).height();

                var scrollPercent = Math.round(100*bottom/height);
                if(!scope.show && !scope.loading && scrollPercent > 95) {
                    scope.$apply(scope.loadMore());
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

ayTemaDs.directive('events',['$window',
function ($window) {
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/pages/events.html',
        restrict : 'E',
        replace : true,
        controller:'EventsCo',
        link: function(scope,element,attrs) {

            var scroll = function() {
                var bottom = $(window).height() + $(window).scrollTop();
                var height = $(document).height();

                var scrollPercent = Math.round(100*bottom/height);
                if(!scope.show && !scope.loading && scrollPercent > 95) {
                    scope.$apply(scope.loadMore());
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