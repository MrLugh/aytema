var ayTemaDs = angular.module('ayTema.directives',[]);

ayTemaDs.directive('user',['userSv',
function(userSv) {
    return function(scope, elm, attrs) {

        scope.$watch('attrs.user',function(){
            var user = eval("(function(){return " + attrs.user + ";})()");
            if (!angular.equals(user,{})) {
                userSv.setUser(user);
            }
        });
    }
}]);

ayTemaDs.directive('resize',['$window',
function ($window) {
    return function (scope,element) {
        var resizeFn = function(){
            scope.$apply(function () {
                scope.winW = $window.innerWidth;
                scope.winH = $window.innerHeight;
                scope.$emit("W.resize");
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

        scope.showUp = false;

        scope.scrollToTop = function() {
            scope.showUp = false;
            $(elm[0]).animate({scrollTop: elm.offset().top}, "slow");
        }

        elm.bind('scroll', function() {

            scope.showUp = (raw.scrollTop > raw.offsetHeight) ? true : false;

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

            if (items.length == 0) {
                scope.masonryLoading = false;
                scope.setList();
                return;
            }

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

        scope.timer = setInterval(function(){scope.layout();},3000);

        var destroy = function() {
            element.unbind('$destroy',destroy);
            clearInterval(scope.timer);
        }

        element.bind('$destroy',destroy);
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

ayTemaDs.directive('getMenuHeight',['$window',
function ($window) {
    return function(scope,element,attrs) {

        scope.getMenuHeight = function() {
            return element[0].offsetHeight;
        };
        scope.initMenuHeight= scope.getMenuHeight();
        scope.menuHeight    = scope.getMenuHeight();

        scope.$watch('getMenuHeight()', function(newValue, oldValue, scope) {
            scope.menuHeight = scope.getMenuHeight();
        });

        $(document).on('shown.bs.collapse',function(elm){
            scope.$apply(function(){
                scope.menuHeight = scope.getMenuHeight();
            });
        });

        $(document).on('hidden.bs.collapse',function(elm){
            scope.$apply(function(){
                scope.menuHeight = scope.getMenuHeight();
            });
        });

        angular.element($window).bind('resize', function(){
            scope.menuHeight = scope.getMenuHeight();
        });
    }
}]);

ayTemaDs.directive('getMenuWidth',[
function () {
    return function(scope,element,attrs) {

        scope.getMenuWidth = function() {
            return element[0].offsetWidth;
        };
        scope.initMenuWidth= scope.getMenuWidth();
        scope.menuWidth    = scope.getMenuWidth();

        scope.$watch('getMenuWidth()', function(newValue, oldValue, scope) {
            scope.menuWidth = scope.getMenuWidth();
        });

        $(document).on('shown.bs.collapse',function(elm){
            scope.$apply(function(){
                scope.menuWidth = scope.getMenuWidth();
            });
        });

        $(document).on('hidden.bs.collapse',function(elm){
            scope.$apply(function(){
                scope.menuWidth = scope.getMenuWidth();
            });
        });
    }
}]);

ayTemaDs.directive('getFooterHeight',['$window',
function ($window) {
    return function(scope,element,attrs) {

        scope.getFooterHeight = function() {
            return element.height();
        };
        scope.footerHeight = scope.getFooterHeight();

        scope.$watch('getFooterHeight()', function(newValue, oldValue, scope) {
            scope.footerHeight = scope.getFooterHeight();
        });

        angular.element($window).bind('resize', scope.footerHeight = scope.getFooterHeight);
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


ayTemaDs.directive('countUp',[
function () {
    return function(scope,element,attrs) {

        scope.countUp = false;

        scope.getNumber = function() {
            return parseInt(attrs.countUp);
        }

        var options = {
          useEasing : true, 
          useGrouping : true,
          separator : ',', 
          decimal : '.' ,
          prefix : '',
          suffix : '',
        }
        
        scope.$watch('getNumber()',function(value){
            if (value && !scope.countUp) {
                scope.countUp = new countUp(element[0], 0, value, 0, 2.5, options);
                scope.countUp.start();
                var countTimer = setTimeout(function(){
                    clearTimeout(countTimer);
                    element[0].innerHTML = attrs.countUp;
                },2500);
            }
        });

        var destroy = function() {
            scope.countUp.stop();
        }
        element.bind('$destroy',destroy);
        
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

                        $FB.Event.subscribe('comment.create', function(response) {
                            scope.$emit("FB.comment");
                            $FB.XFBML.parse($('.fb-comments .fb_iframe_widget').get(0));
                            $FB.XFBML.parse($('.fb-comments-count .fb_iframe_widget').get(0));
                        });

                    };

                    (function(d, s, id, fbAppId) {
                      var js, fjs = d.getElementsByTagName(s)[0];
                      if (d.getElementById(id)) return;
                      js = d.createElement(s); js.id = id;
                      js.src = "//connect.facebook.net/es_LA/all.js#xfbml=1&appId="+fbAppId;
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
                        $(element[0]).addClass('content_shadow');
                        $(".overlay_content").css('opacity',1);
                        scope.$parent.$apply(function(){
                            scope.$parent.showOverlay = true;
                            scope.$parent.indexOverlay = scope.$index;
                        });
                        },1500);
                },
                function(e){
                    $(element[0]).removeClass('content_shadow');
                    $timeout.cancel(scope.timeoutShadow);
                    scope.$parent.$apply(function(){
                        scope.$parent.showOverlay = false;
                        scope.$parent.indexOverlay = -1;
                    });
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

ayTemaDs.directive('caroufredsel',['$window','$timeout',
function ($window,$timeout) {
    return function (scope, element, attrs) {

        var options = attrs.caroufredsel;
        options =  eval("(function(){return " + options + ";})()");

        scope.caroufredsel = function() {
            $timeout(function(){
                angular.element(document.querySelector(options.selector)).carouFredSel(options);
            },500);
        };

        scope.childElementCount = function () {
            return element[0].childElementCount;
        }

        scope.$watch(attrs.caroufredsel, function() {
            scope.caroufredsel();
        });


        scope.$watch('childElementCount()', function() {
            scope.caroufredsel();
        });        

        var destroy = function() {
            element.unbind('$destroy',destroy);
            angular.element(document.querySelector(options.selector)).trigger("destroy");
        }
        element.bind('$destroy',destroy);

        angular.element($window).bind('resize', scope.caroufredsel());

    }
}]);

ayTemaDs.directive('minicolor',['$timeout',
function ($timeout) {
    return function (scope, element, attrs) {

        element.ready(function(){
            $timeout(function(){
                $(element[0]).minicolors({
                    letterCase: 'uppercase',
                    change: function(hex) {
                        scope.setColor(attrs.name,hex);
                    }
                });
            },0);
        });
    }
}]);


ayTemaDs.directive('owlCarousel',['$timeout','$window',
function ($timeout,$window) {
    return function (scope, element, attrs) {

        var options = scope.$eval(attrs.owlCarousel);

        if (!angular.isDefined(options)) {
            options = {
                items:1,
                merge:true,
                loop:true,
                margin:10,
                video:true,
                lazyLoad:true,
                center:true,
                responsive:{
                    480:{
                        items:2
                    },
                    600:{
                        items:4
                    }
                }
            };
        }

        element.ready(function(){
            $timeout(function(){
                $(element[0]).owlCarousel(options);
            },0);
        });

        angular.element($window).bind('resize', function(){
            $timeout(function(){
                $(element[0]).owlCarousel(options);
            },0);
        });
    }
}]);

ayTemaDs.directive('owlCarouselPhotos',['$timeout','$window',
function ($timeout,$window) {
    return function (scope, element, attrs) {

        var options = scope.$eval(attrs.owlCarouselPhotos);
        var time = -1;

        if (!angular.isDefined(options)) {
            options = {
                autoPlay: 3000,
                items : 4,
                lazyLoad : true,
                video:false,
                navigation : false
            };
        }

        element.ready(function(){
            time = $timeout(function(){
                $timeout.cancel(time);
                $(element[0]).owlCarouselPhotos(options);
            },500);
        });

        angular.element($window).bind('resize', function(){
            time = $timeout(function(){
                $timeout.cancel(time);
                $(element[0]).owlCarouselPhotos(options);
            },500);
        });
    }
}]);


ayTemaDs.directive('shareTwitter',['contentSv',
function (contentSv) {
    return function(scope,element,attrs) {

        var content = JSON.parse(attrs.shareTwitter);

        $(element[0]).click(function(event) {
            var url    = this.href;
            window.open(url, 'twitter', contentSv.getTwitterShareOptions(content).join("&"));
            event.preventDefault();
        });
    }
}]);

ayTemaDs.directive('shareFacebook',['contentSv',
function (contentSv) {
    return function(scope,element,attrs) {

        var content = JSON.parse(attrs.shareFacebook);

        $(element[0]).click(function(event) {
            var url    = attrs.href;
            var options= contentSv.getFacebookShareOptions(content);
            options.push("s=100");
            options.push("p[url]="+this.href);
            window.open(url+"?"+options.join("&"), 'facebook');
            event.preventDefault();
        });
    }
}]);

ayTemaDs.directive('shareTumblr',['contentSv',
function (contentSv) {
    return function(scope,element,attrs) {

        var content = JSON.parse(attrs.shareTumblr);
        var options= contentSv.getTumblrShareOptions(content);

        $(element[0]).click(function(event) {

            var url    = attrs.href;
            if (content.concept == 'photo' || content.concept == 'video') {
                url+="/"+content.concept;
            } else if (content.concept == 'track') {
                url+="/audio";
                options.push("url="+encodeURIComponent(contentSv.getTrackUrl(content)));
            }

            window.open(url+"?"+options.join("&"), 'tumblr');
            event.preventDefault();
        });
    }
}]);

ayTemaDs.directive('thumbnail', ['contentSv',
function (contentSv) {
    return {
        restrict: 'A',
        scope: {
            content: '=thumbnail',
        },
        link: function(scope, element, attrs) {

            scope.isBg = false;

            scope.contentSv = contentSv;

            scope.errorSrc = [
                'http://cloudcial.com/img/no-image.png',
                'http://cloudcial.com/img/no_thumb.png'
            ];

            scope.getDefaultImage = function() {
                var errorIndex = ~~(Math.random() * (scope.errorSrc.length - 1 - 0 + 1)) + 0
                return scope.errorSrc[errorIndex];
            }

            scope.getContentThumbnail = function() {
                return contentSv.getThumbnail(scope.content);
            }

            scope.src = scope.getContentThumbnail();

            scope.$watch("src",function(){

                //if(scope.src == 'none') return;

                var img = new Image();

                img.onerror = function() {
                    
                    contentSv.addBadImages(scope.src);
                    scope.src = scope.getContentThumbnail();
                    if (scope.src.length == 0) {
                        scope.src = scope.getDefaultImage();
                    }

                }

                img.onload = function() {

                    if (element[0].tagName == 'IMG') {
                        element.attr('src', scope.src);
                    } else {
                        $(element).css('background-image','url('+scope.src+')');
                    }
                }

                img.src = scope.src;

            });

            scope.$watch("content",function(){
                scope.src = scope.getContentThumbnail();
            });
        }
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


ayTemaDs.directive('scrollMore',['$window',
function($window) {
    return function(scope,element,attr) {

        scope.loading = false;

        scope.scrollToTop = function() {
            $('body').animate({scrollTop: $('body').offset().top}, "fast");
        }

        var scroll = function() {
            var bottom = $(window).height() + $(window).scrollTop();
            var height = $(document).height();

            var scrollPercent = Math.round(100*bottom/height);
            if(!scope.loading && scrollPercent > 95) {
                scope.loading = true;
                scope.$apply(attr.scrollMore);
            }
        }

        var destroy = function() {
            element.unbind('$destroy',destroy);
            angular.element($window).unbind('scroll',scroll);
        }

        angular.element($window).bind('scroll',scroll);
        element.bind('$destroy',destroy);
        
    };
}]);

ayTemaDs.directive('parallax', ['$window', function($window) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      var setPosition = function () {
        // horizontal positioning
        elem.css('left', attrs.parallaxHorizontalOffset + "px");

        var calcValY = $window.pageYOffset * (attrs.parallaxRatio ? attrs.parallaxRatio : 1.1 );
        if (calcValY <= $window.innerHeight) {
          var topVal = (calcValY < attrs.parallaxVerticalOffset ? attrs.parallaxVerticalOffset : calcValY);
          elem.css('top', topVal + "px");
        }
      };

      //setPosition();

      angular.element($window).bind("scroll", setPosition);
      angular.element($window).bind("touchmove", setPosition);
    }  // link function
  };
}]);

ayTemaDs.directive('parallaxBackground', ['$window', function($window) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      var setPosition = function () {
        var calcValY = (elem.prop('offsetTop') - $window.pageYOffset) * (attrs.parallaxRatio ? attrs.parallaxRatio : 1.1 );
        // horizontal positioning
        elem.css('background-position', "50% " + calcValY + "px");
      };

      // set our initial position - fixes webkit background render bug
      angular.element($window).bind('load', function(e) {
        setPosition();
        scope.$apply();
      });

      angular.element($window).bind("scroll", setPosition);
      angular.element($window).bind("touchmove", setPosition);
    }  // link function
  };
}]);

ayTemaDs.directive('dropzone', [function() {
    return {
        restrict: 'A',
        scope: {
            instance: '=dropzoneInstance',
            config:'=dropzone'
        },
        link: function(scope, element, attrs) {
              
            // create a Dropzone for the element with the given options
            scope.instance = new Dropzone(element[0], scope.config.options);
         
            // bind the given event handlers
            angular.forEach(scope.config.eventHandlers, function (handler, event) {
              scope.instance.on(event, handler);
            });

            var destroy = function() {
                element.unbind('$destroy',destroy);
                scope.instance.destroy();
            }

            element.bind('$destroy',destroy);
        }
    }
}]);

ayTemaDs.directive('player', ['$window','contentSv', function($window,contentSv) {
  return {
    restrict: 'C',
    link: function(scope, elem, attrs) {

        scope.hasAudio = function() {
            return elem.find("audio").length;
        };

        scope.hasVideo = function() {
            return elem.find("video").length;
        }

        scope.setThumbnail = function(tag) {
            var thumb = contentSv.getThumbnail(scope.content);
            elem.find(tag).css('background-image','url("'+thumb+'")');
            elem.find(tag).addClass('cover');
            if (scope.hasVideo() && angular.isDefined(elem.find(tag)[0])) {
                elem.find(tag).attr('poster',thumb);
            }
            
        }

        scope.$watch('hasAudio()',function(){
            if (scope.hasAudio() &&
                angular.isDefined(scope.content) &&
                scope.content.network == 'cloudcial' &&
                scope.content.concept == 'track') {
                    scope.setThumbnail('audio');
            }
        },true);

        scope.$watch('hasVideo()',function(){
            if (scope.hasVideo() &&
                angular.isDefined(scope.content) &&
                scope.content.network == 'cloudcial' &&
                scope.content.concept == 'video') {
                    scope.setThumbnail('video');
            }
        },true);

        scope.$watch('content',function(){
            if (scope.hasAudio() &&
                angular.isDefined(scope.content) &&
                scope.content.network == 'cloudcial' &&
                scope.content.concept == 'track') {
                    scope.setThumbnail('audio');
            }
            if (scope.hasVideo() &&
                angular.isDefined(scope.content) &&
                scope.content.network == 'cloudcial' &&
                scope.content.concept == 'video') {
                    scope.setThumbnail('video');
            }
        },true);        

    }  // link function
  };
}]);