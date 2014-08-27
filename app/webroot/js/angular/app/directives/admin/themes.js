ayTemaDs.directive('adminThemes',['$window',
function ($window) {
    return {
        templateUrl : getPath('tpl')+'/admin/themes.html',
        restrict : 'E',
        replace : true,
        controller:'adminThemesCo',
        link: function(scope,element,attrs) {

            scope.$watch('showPreview',function(){
                if (scope.showPreview) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

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

            var scroll = function() {

                var bottom = $(window).height() + $(window).scrollTop();
                var height = $(document).height();

                var scrollPercent = Math.round(100*bottom/height);
                var more = (!scope.loading && scrollPercent > 95) ? true : false;

                scope.showUp = $(window).scrollTop() > $(window).height() ? true : false;

                if (more) {
                    //scope.moreContent();
                }
            }

            var destroy = function() {
                element.unbind('$destroy',destroy);
                angular.element($window).unbind('scroll',scroll);
                document.body.style.overflow = '';
            }

            angular.element($window).bind('scroll',scroll);
            element.bind('$destroy',destroy);
        }        
    }

}]);

ayTemaDs.directive('thumbnailsSlider',[
function () {
    return function (scope,element,attr) {
        
        var current = -1;
        var time    = -1;

        scope.carrousel = function() {

            current++;
            if (current == scope.theme.thumbnails.length) {
                current = 0;
            }
            if (current < 0) {       
                current = scope.theme.thumbnails.length - 1;
            }

            $(element).css('backgroundImage',"url('"+scope.theme.thumbnails[current]+"')");

            if (time == -1) {
                time = setInterval(function(){scope.carrousel();},5000);
            }
            
        }

        element.ready(function(){
            var loaded = 0;
            var images = [];
            for(var x in scope.theme.thumbnails) {
                images[x] = new Image();
                images[x].src = scope.theme.thumbnails[x];
                $(images[x]).load(function(){
                    loaded++;
                    if (loaded == scope.theme.thumbnails.length) {
                        scope.$apply(scope.carrousel());
                    }
                });
            }
        });

        element.bind('$destroy',function(){
            if (time) {
                clearInterval(time);
            }            
        });

    };
}]);