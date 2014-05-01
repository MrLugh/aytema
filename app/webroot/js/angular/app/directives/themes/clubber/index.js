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

            scope.scrollToTop = function() {
                scope.showUp = false;
                $('body').animate({scrollTop: $('body').offset().top}, "slow");
            }

            $(window).scroll(function() {
                scope.$apply(scope.showUp = ($(window).scrollTop() > $(window).height()) ? true : false);
                console.log(scope.showUp);
            });


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

        setInterval(function(){
            scope.masonry.layout();
        },500);
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


ayTemaDs.directive('hoverVertical',['$timeout',
function ($timeout) {
    return function (scope, element, attrs) {

        var last_y = 0;

        element.ready(function(){

            element.bind('mousemove',function(e){

                if (last_y && last_y<e.pageY) {
                    $(element[0]).removeClass('photo_up').addClass('photo_down');
                } else if (last_y && last_y>e.pageY) {
                    $(element[0]).removeClass('photo_down').addClass('photo_up');
                }
                last_y = e.pageY;
            });

            $(element).hover(
                function(e){},
                function(e){$(element[0]).removeClass('photo_down').removeClass('photo_up');}
            );

        });



    }
}]);