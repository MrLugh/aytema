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

ayTemaDs.directive('onScroll',[
function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        var scrolling = false;

        scope.onScrollFn = function() {

            var childrens = elm[0].children;

                var founded = false;

                for (var x in childrens) {

                    if (!angular.isDefined(parseInt(x)) || isNaN(parseInt(x))) {
                        continue;
                    }

                    var child = angular.element(childrens[x]);

                    if (!founded && $(child[0]).position().top + child[0].clientHeight / 2 > 0 ) {
                        founded = true;
                        imagesLoaded(child[0], function(){
                            $(child[0]).addClass('content_hover');
                        });
                    } else {
                        if ( document.querySelector(".content_hover") != elm[0] ) {
                            $(child[0]).removeClass('content_hover');
                        }
                    }

            }

            //scrolling = false;

        }


        elm.bind('scroll', function(e) {scope.onScrollFn();});

        scope.$on("W.resize", function(e) {scope.onScrollFn();});
    };
}]);

ayTemaDs.directive('onHover',[
function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        var scrolling = false;

        elm.ready(function(){
            console.log("ready ",'#content_'+scope.$index+' .player');
            console.log(document.querySelector('#content_'+scope.$index+' .player'));
        });

        elm.hover(
        function() {

        	if ( document.querySelector(".content_hover") == elm[0] ) {
        		return false;
        	}

        	$(document.querySelector(".content_hover")).removeClass('content_hover');
            $(elm[0]).addClass('content_hover');
        },
        function() {

        	if ( document.querySelector(".content_hover") == elm[0] ) {
        		return false;
        	}

        	$(elm[0]).removeClass('content_hover');
        }
        );
    };
}]);

ayTemaDs.directive('controlHover',[
function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        var sufix = attr.controlHover;

        elm.ready(function(){

            elm.hover(
                function(){

                    console.log(scope);
                    scope.$apply(function(){
                        scope.$parent.controlHover = true;
                        scope.$parent.getContentStyle();
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
                        scope.$parent.getContentStyle();
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