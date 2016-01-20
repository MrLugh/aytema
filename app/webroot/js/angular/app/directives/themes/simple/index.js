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
                if (scope.user.profile_image.length) {
                    if ($(window).scrollTop() > window.innerHeight) {
                        $('nav').show();
                    } else {
                        $('nav').hide();
                    }
                }
            };

            $(window).scroll(scroll);

            scope.$watch("userSv.getUser()",function(user){
                scroll();
            },true);

        }
    }

}]);

ayTemaDs.directive('content',[
function(){
    
    return {
        restrict : 'C',
        link: function(scope,element,attrs) {

            var loaded = false;

            if (!loaded) {
                imagesLoaded(element[0],function(){
                    loaded = true;
                    var timer = setTimeout(function(){
                        clearTimeout(timer);
                        /*
                        element.addClass('animated fadeInDown');
                        element.find('.left_column').addClass('animated fadeInDown');
                        element.find('.right_column').addClass('animated fadeInDown');
                        */
                        element.css('opacity',1);
                        /*
                        $('html, body').animate({
                            scrollTop: $(document).height() - 40
                        }, 1500);
                        */
                    },350);
                });
            }
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