ayTemaDs.directive('themeSimple',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/simple/index.html',
        restrict : 'E',
        replace : true,
        controller:'themeSimpleCo',
        scope: true,
        link: function(scope,element,attrs) {

        }
    }

}]);


ayTemaDs.directive('controlHover',[
function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        var sufix = attr.controlHover;

        elm.ready(function(){

            elm.hover(
                function(){

                    scope.$apply(function(){
                        scope.$parent.controlHover = true;
                    });
                    
                    var prev = angular.element(document.querySelector(".control_prev"));
                    $(prev[0]).addClass('control_prev_hover');
                    var next = angular.element(document.querySelector(".control_next"));
                    $(next[0]).addClass('control_next_hover');

                    //$(elm[0]).addClass('control_'+sufix+'_hover');
                },
                function(){

                    scope.$apply(function(){
                        scope.$parent.controlHover = false;
                    });

                    var prev = angular.element(document.querySelector(".control_prev"));
                    $(prev[0]).removeClass('control_prev_hover');
                    var next = angular.element(document.querySelector(".control_next"));
                    $(next[0]).removeClass('control_next_hover');

                    //$(document.querySelector(".content_hover")).css('opacity','');
                    //$(elm[0]).removeClass('control_'+sufix+'_hover');
                }
            );
        });
    };
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