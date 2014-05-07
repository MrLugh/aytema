ayTemaDs.directive('themeSpace',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/space/index.html',
        restrict : 'E',
        replace : true,
        controller:'themeSpaceCo',
        scope: true,
        link: function(scope,element,attrs) {

            $( window ).resize(function() {
                scope.$apply(scope.scrollCurrent());
            });

        }
    }

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