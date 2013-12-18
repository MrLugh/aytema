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

ayTemaDs.directive("masonry2", function () {
    var NGREPEAT_SOURCE_RE = '<!-- ngRepeat: ((.*) in ((.*?)( track by (.*))?)) -->';
    return {
        compile: function(element, attrs) {
            // auto add animation to brick element
            var animation = attrs.ngAnimate || "'masonry'";
            var $brick = element.children();
            $brick.attr("ng-animate", animation);
            
            // generate item selector (exclude leaving items)
            var type = $brick.prop('tagName');
            var itemSelector = type+":not([class$='-leave-active'])";
            
            return function (scope, element, attrs) {
                var options = angular.extend({
                    itemSelector: itemSelector
                }, scope.$eval(attrs.masonry));
                
                // try to infer model from ngRepeat
                if (!options.model) { 
                    var ngRepeatMatch = element.html().match(NGREPEAT_SOURCE_RE);
                    if (ngRepeatMatch) {
                        options.model = ngRepeatMatch[4];
                    }
                }
                
                // initial animation
                element.addClass('masonry');
                
                // Wait inside directives to render
                setTimeout(function () {
                    element.masonry(options);
                    
                    element.on("$destroy", function () {
                        element.masonry('destroy')
                    });
                    
                    if (options.model) {
                        scope.$apply(function() {
                            scope.$watchCollection(options.model, function (_new, _old) {
                                if(_new == _old) return;
                                
                                // Wait inside directives to render
                                setTimeout(function () {
                                    element.masonry("layout");
                                });
                            });
                        });
                    }
                });
            };
        }
    };
})

ayTemaDs.directive('masonry',['$timeout',
function ($timeout) {
    return function (scope, element, attrs) {

        var options = scope.$eval(attrs.masonry);

        if (!angular.isDefined(options)) {
            options = {columnWidth:10,gutter:10,isAnimated:false,itemSelector:'.adminContent'};
        }

        scope.createMasonry = function() {
            var container = element[0];
            scope.masonry = new Masonry(container,options);
        }

        scope.addToMasonry = function(elm,index) {

            scope.userMessage = "Adding "+(index) +" of "+scope.getListLength();
            imagesLoaded(elm[0], function(){
                jQuery.when(scope.masonry.appended(elm[0])).done(function(event) {
                    scope.userMessage = "Adding "+(index) +" of "+scope.getListLength();
                    imagesLoaded(document.querySelector('body'), function(){
                        $(elm[0]).css('opacity','1');
                    });
                    scope.userMessage = "Waiting images/iframes "+scope.getListLength()+", "+scope.masonry.getItemElements().length;
                    if (scope.getListLength() == scope.masonry.getItemElements().length) {
                        scope.userMessage = "Last loaded! Finishing...";
                        scope.enableMasonry();
                        scope.masonry.layout();
                        imagesLoaded(document.querySelector('body'), function(){
                            scope.userMessage = "";                          
                            scope.masonry.layout();
                        });
                    }
                });
            });

        }   

        scope.removeFromMasonry = function(elm) {
            jQuery.when( scope.masonry.remove(elm) ).done(function(event) {
                $(elm).css('opacity','0');
                jQuery.when( $(elm).remove() ).done(function(event) {
                    if (!scope.masonry.getItemElements().length) {
                        scope.masonryLoading = true;
                        scope.setList();
                    }
                });
            });
        }

        scope.reinitMasonry = function() {

            if (scope.getListLength() == 0 && !scope.masonryLoading) {
                scope.masonryLoading = false;
                scope.setList();
                return;
            }
            scope.masonryLoading = true;
            scope.clearList();

            var items = [];
            for (var x in scope.masonry.items) {
                items.push(scope.masonry.items[x].element);
            }
            for (var x in items) {
                scope.userMessage = "Deleting "+x+" of "+items.length;
                scope.removeFromMasonry(items[x]);
            }                
        }

        scope.$on("FB.render", function(event){
            scope.masonry.layout();
        });

        scope.$on("TW.render", function(event){
            scope.masonry.layout();
        });        

        scope.createMasonry();

        scope.layout = function() {
            if (!scope.masonryLoading) {
                scope.masonry.layout();
                scope.userMessage = "";
            }
        }

        setInterval(function(){scope.layout();},3000);
    }
}]);

ayTemaDs.directive('masonryItem',['$timeout',
function ($timeout) {
    return function (scope, element, attrs) {

        var masonry = scope.$parent.masonry;
        var parent  = scope.$parent;
        $(element[0]).css('opacity','0');

        element.ready(function(){
            if (scope.$last === true) {
                scope.$parent.enableMasonry();
                scope.userMessage = "Adding last...";
            } else {
                scope.userMessage = "Adding "+(scope.$index + 1)+" of "+scope.$parent.getListLength();
            }

            scope.$parent.addToMasonry(element,scope.$index+1);
        });
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


ayTemaDs.directive('user_message', [
function() {
    return {
        restrict: "C",
        replace: true,
        compile: function(tElem, tAttrs) {
            return function(scope,element,attrs) {
                scope.getMessagePosition = function() {
                    return  {
                        top:element[0].offsetTop,
                        height:element[0].clientHeight,
                        width:element[0].clientWidth,
                        left:element[0].clientLeft
                    }
                };
                scope.getPosition();
            }
        }        
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

                        $FB.Event.subscribe("xfbml.render", function () {
                            scope.$emit("FB.render");
                        });

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
                        $(".overlay_content").css('opacity',0.9);
                        scope.$parent.showOverlay = true;
                        scope.$parent.indexOverlay = scope.$index;
                        },1500);
                },
                function(e){
                    $(element[0]).css('z-index','');
                    $(element[0]).removeClass('content_shadow');
                    $(".overlay_content").css('z-index','');
                    $(".overlay_content").css('opacity',0);
                    $timeout.cancel(scope.timeoutShadow);
                    $(element[0]).css('transition','');
                    scope.$parent.showOverlay = false;
                    scope.$parent.indexOverlay = scope.$index;
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
