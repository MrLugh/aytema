ayTemaDs.directive('adminAccount',['$window',
function ($window) {
    return {
        templateUrl : getPath('tpl')+'/admin/account.html',
        restrict : 'E',
        replace : true,
        scope : {
            account : "=account"
        },
        controller:'adminAccountCo',
        link: function(scope,element,attrs) {

            var raw = $('body');
            scope.showUp = false;
            scope.scrolling = false;
            scope.scrollTop = 0;

            scope.scrollToTop = function() {
                if (scope.scrolling) {
                    return false;
                }
                scope.scrolling = true;
                scope.showUp = false;
                $('body').animate({scrollTop: $('body').offset().top}, "slow");
                scope.scrolling = false;
            }

            var scroll = function() {

                var bottom = $(window).height() + $(window).scrollTop();
                var height = $(document).height();

                scope.$apply(function(){
                    scope.scrollTop = $(window).scrollTop();
                });                

                var scrollPercent = Math.round(100*bottom/height);
                var more = (!scope.loading && scrollPercent > 99) ? true : false; 

                scope.showUp = $(window).scrollTop() > $(window).height() ? true : false;
                
                if (more && !scope.isAdding) {
                    scope.moreContent();
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