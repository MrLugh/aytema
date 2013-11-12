var ayTemaDs = angular.module('ayTema.directives',[]);

ayTemaDs.directive('resize',['$window', 
function ($window) {
    return function (scope,element) {
        var resizeFn = function(){
            scope.$apply(function () {
                scope.winW = $window.innerWidth;
                scope.winH = $window.innerHeight;
            });
        };
        var destroy = function(){
            element.unbind('$destroy',destroy);
            angular.element($window).unbind('resize',resizeFn);
        }
        scope.winW = $window.innerWidth;
        scope.winH = $window.innerHeight;
        angular.element($window).bind('resize', resizeFn);
        element.bind('$destroy',destroy);
    };
}]);

ayTemaDs.directive('infiniteScroll',[
function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight*.9) {
                scope.scroll = raw.scrollTop + raw.offsetHeight;
                scope.$apply(attr.infiniteScroll);
                scope.$apply();
            }
        });
    };
}]);

ayTemaDs.directive('masonry',[
function () {
    return function (scope, element, attrs) {

        // TODO: Need to check if attrs.masonry exists
        // Add css transitions!

        var options = attrs.masonry;
        options =  eval("(function(){return " + options + ";})()");

        var container = element[0];
        scope.masonry = new Masonry(container,options);
        scope.$apply();
    }
}]);

ayTemaDs.directive('masonryItem',['$timeout',
function ($timeout) {
    return function (scope, element, attrs) {

        element.ready(function(){
            $timeout(function(){
                if(scope.$last===true) console.log("Scope ",scope);
                var masonry = scope.$parent.masonry;
                imagesLoaded( masonry.element, function() {
                    masonry.appended(element[0]);
                    scope.$apply();
                });
            },0);
        });

    }
}]);


ayTemaDs.directive('getOffsetTop',[
function () {
    return function(scope,element,attrs) {
        scope.getOffsetTop = function() {
            return element[0].offsetTop;
        }
        scope.$apply();
    }
}]);