ayTemaDs.directive('themeClubber',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/index.html',
        restrict : 'E',
        replace : true,
        controller:'themeClubberCo',
        scope: true,
        link: function(scope,element,attrs) {

            var raw = $('body');
            scope.showUp = false;
            scope.scrolling = false;
            var timer = -1;

            scope.scrollToTop = function() {
                if (scope.scrolling) {
                    return false;
                }
                scope.scrolling = true;
                scope.showUp = false;
                $('body').animate({scrollTop: $('body').offset().top}, "slow");
                scope.scrolling = false;

            }

            $(window).scroll(function() {
                scope.$apply(function() {
                    $('body').addClass('scrolling');
                    scope.showUp = ($(window).scrollTop() > $(window).height()) ? true : false;
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        $('body').removeClass('scrolling');
                    },500);
                });
            });

        }
    }

}]);

ayTemaDs.directive('relatedContents',['contentSv',
function(contentSv){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/related.html',
        restrict : 'E',
        replace : true,
        controller:'relatedCo',
        scope: true,
        link: function(scope,element,attrs) {

        }
    }

}]);


ayTemaDs.directive('fbComments',['$FB','$timeout',
function($FB,$timeout){
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/comments.html',
        restrict : 'E',
        replace : true,
        link: function(scope,element,attrs) {

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

ayTemaDs.directive('masonrySimple',['$timeout',
function ($timeout) {
    return function (scope, element, attrs) {

        var options = scope.$eval(attrs.masonrySimple);

        scope.createMasonry = function() {
            var container = element[0];
            scope.masonry = new Masonry(container,options);
        }
        scope.createMasonry();

        scope.addToMasonry = function(elm) {

            jQuery.when(scope.masonry.appended(elm[0])).done(function(event) {
                scope.masonry.layout();
            });
        }           


        scope.timer = setInterval(function(){
            scope.masonry.layout();
        },1500);

        var destroy = function() {
            element.unbind('$destroy',destroy);
            clearTimeout(scope.timer);
        }

        element.bind('$destroy',destroy);
    }
}]);

ayTemaDs.directive('masonrySimpleItem',['$timeout',
function ($timeout) {
    return function (scope, element, attrs) {

        var masonry = scope.$parent.masonry;

        element.ready(function(){
            imagesLoaded(element[0],function(){
                scope.$parent.addToMasonry(element);
            });
        });
    }
}]);