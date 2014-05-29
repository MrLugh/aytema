ayTemaDs.directive('adminAccount',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/account.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'adminAccountCo',
        link: function(scope,element,attrs) {

            var raw = $('body');
            scope.showUp = false;
            scope.scrolling = false;

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
                scope.$apply(function(){
	                scope.showUp = $(window).scrollTop() > $(window).height() ? true : false;
                })
            });

        }
    }

}]);