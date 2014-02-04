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

ayTemaDs.directive('addToQueue',['contentSv',
function(contentSv) {
    return function(scope, elm, attr) {

        $(elm[0]).click(function(event) {

            scope.$apply(contentSv.addToQueue(scope.content));

        });
        
    };
}]);
