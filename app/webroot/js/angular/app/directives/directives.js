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

ayTemaDs.directive('skipDefault',[
function() {
    return function(scope, element) {
        $(element).click(function(event) {
            event.preventDefault();
        });
    }
}]);

ayTemaDs.directive('infiniteScroll',[
function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight*.9) {
                scope.scroll = raw.scrollTop + raw.offsetHeight;
                scope.$apply(attr.infiniteScroll);
            }
        });
    };
}]);

ayTemaDs.directive('masonry',['$timeout',
function ($timeout) {
    return function (scope, element, attrs) {

        var options = attrs.masonry;
        options =  eval("(function(){return " + options + ";})()");

        if (!angular.isDefined(options)) {
            options = {columnWidth:10,gutter:10,isAnimated:false,itemSelector:'.adminContent'};
        }

        var container = element[0];
        scope.masonry = new Masonry(container,options);

        scope.addToMasonry = function(elm) {
            
            console.log("adding to masonry after loading ");
            imagesLoaded(elm[0], function(){
                jQuery.when(scope.masonry.appended(elm[0])).done(function(event) {
                        $(elm[0]).css('opacity','1');
                        console.log("added ",scope.getListLength(),scope.masonry.getItemElements().length);
                        if (scope.getListLength() == scope.masonry.getItemElements().length) {
                            console.log("last inserted");
                            scope.masonry.layout();
                            imagesLoaded(document.querySelector('body'), function(){
                                console.log("last loaded");
                                console.log(elm);
                                console.log(elm[0]);                              
                                console.log(elm.find('img').length);
                                scope.masonry.layout();
                                //Timeout is not contentSv.isLoading!!!
                                scope.enableMasonry();
                                console.log("ACTIVE!!!!!!!!!");
                                
                            });
                        }
                });
            });
        }        

        scope.reinitMasonry = function() {

            console.log(scope.masonryLoading,scope.masonry.getItemElements().length,scope.getListLength());

            if (scope.getListLength() == 0 && !scope.masonryLoading) {
                console.log("ENTRO");
                scope.masonryLoading = false;           
                scope.setList();
                return;
            }
            scope.masonryLoading = true;            
            scope.clearList();
        }

        scope.removeFromMasonry = function(index) {

            var obj = scope.masonry.getItemElements()[index];
            console.log(obj);
            console.log("REMOVE ",scope.masonry.getItemElements().length,scope.getListLength());
            jQuery.when( scope.masonry.remove(element) ).done(function(event) {
                scope.masonry.layout();
            });
        }
    }
}]);

ayTemaDs.directive('masonryItem',['$timeout',
function ($timeout) {
    return function (scope, element, attrs) {

        var masonry = scope.$parent.masonry;
        var parent  = scope.$parent;
        $(element[0]).css('opacity','0');

        if (scope.$last === true) {
            console.log("LAST ITEM STARTING");
            console.log(element);
            console.log(element.find('img').length);
        }

        element.ready(function(){

            //$timeout(function(){

                var iframes = element.find("iframe");
                iframes = (iframes.length == 1) ? [iframes] : iframes;
                var count   = 0;

                if (iframes.length) {
                    for (var x in iframes) {
                        $(iframes[x]).bind('load',function(event){
                            count++;
                            if (count == iframes.length) {
                                if (scope.$last === true) {
                                    console.log("LAST ITEM TO ADD");
                                    console.log(element);
                                }
                                scope.$parent.addToMasonry(element);
                            }
                        });
                    }
                } else {
                    scope.$parent.addToMasonry(element);
                }

            //},30);

                if (scope.$last === true) {

                    /*
                    $timeout(function(){
                        imagesLoaded( document.querySelector('body'),function() {
                            console.log("once");
                            scope.masonry.layout();
                            //scope.masonry.reloadItems();
                            parent.masonryLoading = false;
                        });
                    },10000);
                    */
                }
        });

        var destroy = function() {
            jQuery.when( masonry.remove(element) ).done(function(event) {
                console.log("destroy ",masonry.getItemElements().length);
                if (masonry.getItemElements().length == 0) {
                    console.log("last destroyed, setList");
                    parent.setList();
                }
            });
        }

        element.bind('$destroy', destroy);
    }
}]);

ayTemaDs.directive('getOffsetTop',[
function () {
    return function(scope,element,attrs) {
        scope.getOffsetTop = function() {
            return element[0].offsetTop;
        };
    }
}]);


ayTemaDs.directive('fb', ['$FB',
function($FB) {
    return {
        restrict: "E",
        replace: true,
        template: "<div id='fb-root'></div>",
        compile: function(tElem, tAttrs) {
            return {
                post: function(scope, iElem, iAttrs, controller) {
                    var fbAppId = iAttrs.appId || '';

                    var fb_params = {
                        appId: iAttrs.appId || "",
                        cookie: iAttrs.cookie || true,
                        status: iAttrs.status || true,
                        xfbml: iAttrs.xfbml || true
                    };

                    // Setup the post-load callback
                    window.fbAsyncInit = function() {
                        $FB._init(fb_params);

                        if('fbInit' in iAttrs) {
                            iAttrs.fbInit();
                        }
                    };

                    (function(d, s, id, fbAppId) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) return;
                        js = d.createElement(s); js.id = id; js.async = true;
                        js.src = "//connect.facebook.net/en_US/all.js";
                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, 'script', 'facebook-jssdk', fbAppId));
                }
            }
        }
    };
}]);

ayTemaDs.directive('hoverShadow',['$timeout',
function ($timeout) {
    return function (scope, element, attrs) {

        element.ready(function(){

            $(element).hover(
                function(e){
                    scope.timeoutShadow = $timeout(function(){
                        $(element[0]).css('transition','all 0.66s ease 0s');
                        $(element[0]).css('z-index',100);
                        $(element[0]).addClass('content_shadow');
                        $(".overlay_content").css('z-index',99);
                        $(".overlay_content").css('opacity',1);
                        },1500);
                },
                function(e){
                    $(element[0]).css('z-index','');
                    $(element[0]).removeClass('content_shadow');
                    $(".overlay_content").css('z-index','');
                    $(".overlay_content").css('opacity',0);
                    $timeout.cancel(scope.timeoutShadow);
                    $(element[0]).css('transition','');
                }
            );

        });

    }
}]);

ayTemaDs.directive('restrictsize',[
function () {
    return function (scope, element, attrs) {

        element.css('opacity','0');

        element.bind("load" , function(event) {

            var size = attrs.restrictsize;
            var currW= element[0].naturalWidth;
            var currH= element[0].naturalHeight;
            var ratio= 0;

            var ratio = currH / currW;
            if(currW >= size && ratio <= 1){
                currW = size;
                currH = Math.ceil(currW * ratio);
            } else if(currH >= size){
                currH = size;
                currW = Math.ceil(currH / ratio);
            }

            element.css('position','relative');
            element.css('top',(size == currH) ? 0 : parseInt((size - currH)/2))+'px';
            element.css('width',currW + 'px');
            element.css('height',currH + 'px');
            element.css('opacity','1');

        });

    }
}]);

ayTemaDs.directive('caroufredsel',[
function () {
    return function (scope, element, attrs) {

        element.ready(function(){
            var options = attrs.caroufredsel;
            options =  eval("(function(){return " + options + ";})()");
            if (scope.$last === true) {
                jQuery(options.selector).carouFredSel(options);
            }
        });
    }
}]);

ayTemaDs.directive('minicolor',[
function () {
    return function (scope, element, attrs) {

        element.ready(function(){
            $(element[0]).minicolors({
                letterCase: 'uppercase',
                change: function(hex) {
                    scope.setColor(attrs.name,hex);
                }
            });
        });
    }
}]);
