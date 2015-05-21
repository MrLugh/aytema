ayTemaDs.directive('themeDj',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/dj/index.html',
        restrict : 'E',
        replace : true,
        controller:'themeDjCo',
        scope: true,
        link: function(scope,element,attrs) {

            var resizeTimer = -1;
            var scrollTimer = -1;

            //setTimeout(function(){
                $("#menu_init").show(500);
                //$("body").css('overflow','auto');
                //$("body").css('overflowX','hidden');
            //},2500);

            $( window ).resize(function() {
                //$(".navbar-collapse").removeClass("in");
                clearTimeout(resizeTimer);
                //resizeTimer = setTimeout(function(){
                    if (!scope.showingDetail) {
                        scope.scrollToSection(scope.current);
                    }
                //},500);
            });

            $( window ).scroll(function() {

                clearTimeout(scrollTimer);
                //scrollTimer = setTimeout(function(){

                    var current = scope.current;
                    for (var x in scope.pages) {

                        if (scope.showingDetail) {
                            continue;
                        }

                        var page = document.querySelector("#page_"+scope.pages[x]);
                        if (angular.isDefined(page) && $(window).scrollTop() + 50 > angular.element(page).offsetTop) {
                            current = 'page_'+scope.pages[x];
                        }
                    }
                    scope.$apply(function(){scope.current = current;});
                //},1000);
            });

        }
    }

}]);


ayTemaDs.directive('fbComments',['$FB','$timeout',
function($FB,$timeout){
    return {
        templateUrl : getPath('tpl')+'/themes/dj/comments.html',
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

ayTemaDs.directive('relatedContents',['contentSv',
function(contentSv){
    
    return {
        templateUrl : getPath('tpl')+'/themes/dj/related.html',
        restrict : 'E',
        replace : true,
        controller:'relatedCo',
        scope: true,
        link: function(scope,element,attrs) {

        }
    }

}]);