ayTemaDs.directive('themeSpace',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/space/index.html',
        restrict : 'E',
        replace : true,
        controller:'themeSpaceCo',
        scope: true,
        link: function(scope,element,attrs) {

        }
    }

}]);

ayTemaDs.directive('onScroll',[
function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        var scrolling = false;

        elm.bind('scroll', function() {

            var childrens = elm[0].children;

            if (!scrolling) {

                scrolling = true;

                var founded = false;

                for (var x in childrens) {

                    if (!angular.isDefined(parseInt(x)) || isNaN(parseInt(x))) {
                        continue;
                    }

                    var child = angular.element(childrens[x]);

                    $(child[0]).removeClass('content_hover');
                    if (!founded && $(child[0]).position().top + child[0].clientHeight / 2 > 0 ) {
                        founded = true;
                        $(child[0]).addClass('content_hover');
                        scope.$apply(function(){
                            scope.current = x;
                        });
                    } else {
                        $(child[0]).removeClass('content_hover');
                    }
                }
            }

            scrolling = false;

        });
    };
}]);

ayTemaDs.directive('onHover',[
function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        var scrolling = false;

        elm.hover(
        function() {

            if ( document.querySelector(".content_hover") == elm[0] ) {
                return false;
            }

            $(document.querySelector(".content_hover")).removeClass('content_hover');
            $(elm[0]).addClass('content_hover');

            scope.$apply(function(){
                scope.$parent.current = scope.$index;
            });

        },
        function() {

            $(document.querySelector(".content_hover .overlay_photo")).css('background-position','left top');
            if ( document.querySelector(".content_hover") == elm[0] ) {
                return false;
            }

            $(elm[0]).removeClass('content_hover');

        }
        );
    };
}]);

ayTemaDs.directive('addToQueue',['contentSv',
function(contentSv) {
    return function(scope, elm, attr) {

        $(elm[0]).click(function(event) {

            scope.$apply(contentSv.addToQueue(scope.content));

        });
        
    };
}]);

ayTemaDs.directive('onHoverPosition',['contentSv',
function(contentSv) {
    return function(scope, elm, attr) {

        elm.hover(
        function() {
            $(elm[0]).css('background-position','center center');
        },
        function() {

        }
        );
        
    };
}]);

ayTemaDs.directive('onLoad',['contentSv',
function(contentSv) {
    return function(scope, elm, attr) {
        elm.imagesLoaded(function(){
            //$(elm[0]).css('opacity',1).css('width','85%').css('height','auto');
        });
    };
}]);


ayTemaDs.directive('fbComments',['$FB','$timeout',
function($FB,$timeout){
    return {
        templateUrl : getPath('tpl')+'/themes/space/comments.html',
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