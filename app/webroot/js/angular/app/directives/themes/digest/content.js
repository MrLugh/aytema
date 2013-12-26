ayTemaDs.directive('contentVideo',['$FB','$timeout',
function($FB,$timeout){    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/video.html',
        restrict : 'E',
        replace : true,
        controller:'contentVideoCo',
        scope: true,
        link: function(scope,element,attrs) {

            if (scope.isFromNetwork('facebook')) {
                element.ready(function(){
                    $timeout(function(){
                        scope.$FB = $FB;
                        scope.$apply();
                        scope.$watch('$FB.loaded',function(value) {
                            // It needs authentication, this won't work.
                            if(value){
                                if (typeof $FB  != "undefined"){
                                    $FB.XFBML.parse($('#'+element[0].id+' .fb_iframe_widget').get(0));
                                }
                            }
                        },true);
                        scope.$apply();
                    },0);
                });
            }
        } 
    }

}]);

ayTemaDs.directive('contentPhoto',[
function(){
    return {
        templateUrl : getPath('tpl')+'/themes/digest/photo.html',
        restrict : 'E',
        replace : true,
        controller:'contentPhotoCo',
        scope: true
    }

}]);

ayTemaDs.directive('contentTrack',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/track.html',
        restrict : 'E',
        replace : true,
        controller:'contentTrackCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentChat',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/chat.html',
        restrict : 'E',
        replace : true,
        controller:'contentChatCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentQuote',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/quote.html',
        restrict : 'E',
        replace : true,
        controller:'contentQuoteCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentPost',['$FB','$timeout',
function($FB,$timeout){    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/post.html',
        restrict : 'E',
        replace : true,
        controller:'contentPostCo',
        scope: true,
        link: function(scope,element,attrs) {

            if (scope.isFromNetwork('facebook')) {
                element.ready(function(){
                    $timeout(function(){
                        scope.$FB = $FB;
                        scope.$apply();
                        scope.$watch('$FB.loaded',function(value) {
                            // It needs authentication, this won't work.
                            if(value){
                                if (typeof $FB  != "undefined"){
                                    $FB.XFBML.parse($('#'+element[0].id+' .fb_iframe_widget').get(0));
                                }
                            }
                        },true);
                        scope.$apply();
                    },0);
                });
            }

            /*
            if (scope.isFromNetwork('twitter')) {

                if (!window.twttr) {
                    window.twttr = (function (d,s,id) {
                      var t, js, fjs = d.getElementsByTagName(s)[0];
                      if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
                      js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
                      return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
                    }(document, "script", "twitter-wjs"));
                }

                twttr.ready(function(){

                    twttr.events.bind('rendered', function (twElement) {
                        scope.$emit("TW.render");
                    });

                    twttr.widgets.createTweet(
                        scope.content.external_id,
                        element[0],
                        function (el) {
                            scope.$emit("TW.render");
                        },
                        {}
                    );

                });
                
            }
            */
        } 
    }

}]);

ayTemaDs.directive('contentDetailVideo',['appSv','$window',
function(appSv,$window){
    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/detail/video.html',
        restrict : 'E',
        replace : true,
        controller:'contentVideoCo',
        scope: true,
        link: function(scope,element,attrs) {

            scope.resizeRight = function() {

                var container = angular.element(document.querySelector('.content_detalle .section'));
                var right = angular.element(document.querySelector('.content_detalle .right-column'));
                $(right[0]).css('height','');
                var padding = parseInt($(container[0]).css('padding').replace('px','')) || 10;
                var myHeight= appSv.getMyWH() - padding -1;
                console.log("RESIZERIGHT!!!!!! ",$window.innerWidth,right.height(),myHeight);

                if ($window.innerWidth > 480) {
                    $(right[0]).css('height',myHeight+'px');
                }
            }

            scope.resizeContent = function() {

                var container = angular.element(document.querySelector('.content_detalle .section'));

                var toResize    = angular.element(
                    element[0].querySelector('iframe')  || 
                    element[0].querySelector('object')  ||
                    element[0].querySelector('embed')
                );

                var player      = angular.element(element[0].querySelector('.player'));
                $(toResize[0]).css('opacity','0').css('height','').css('width','');

                console.log(toResize.width(),toResize.height());

                var myWidth = element.width();
                var padding = parseInt($(container[0]).css('padding').replace('px','')) || 10;

                if ($window.innerWidth <= 480) {
                    console.log("WIDTH");
                    //var myHeight = toResize.height() +2*padding +2;
                    var myHeight = toResize.height();
                    var currW= toResize.width();
                    var currH= toResize.height();
                    var ratio = currH / currW;
                    var myRatio = myWidth / myHeight ;

                    currW = myWidth;
                    if(ratio <= 1){
                        currH = Math.ceil(currW * ratio);
                    } else {
                        currH = Math.ceil(currW / ratio);
                    }

                    console.log("myW ",myWidth,myHeight);
                    console.log("original ratio ",ratio,toResize.width(),toResize.height());
                    console.log("END ",currW / currH,currW,currH);

                } else {
                    console.log("HEIGHT");
                    var myHeight= appSv.getMyWH() - toResize[0].offsetTop - 2*padding -2;
                    var currW= toResize.width();
                    var currH= toResize.height();
                    var ratio = currH / currW;
                    var myRatio = myHeight / myWidth;

                    currH = myHeight;
                    currW = currH / myRatio;

                    console.log("myW ",myWidth,myHeight);
                    console.log("original ratio ",ratio,toResize.width(),toResize.height());
                    console.log("END ",currH / currW,currW,currH);                    
                }

                $(toResize[0]).css('height',currH+'px').css('width',currW+'px').css('opacity','1');
                //$(player[0]).css('height',myHeight+'px');
            }

            scope.appSv = appSv;
            scope.$watch('appSv.getMyWH()', function(newValue, oldValue) {
                imagesLoaded(element[0],function(){
                    scope.resizeContent();
                    scope.resizeRight();
                });
            });

            scope.$watch('current.src', function(newValue, oldValue) {
                if (!angular.equals(newValue,oldValue)) {
                    imagesLoaded(element[0],function(){
                        scope.resizeContent();
                        scope.resizeRight();
                    });
                }
            },true);
        }
    }

}]);


ayTemaDs.directive('contentDetailPhoto',['appSv','$window',
function (appSv,$window) { 
    return {
        templateUrl : getPath('tpl')+'/themes/digest/detail/photo.html',
        restrict : 'E',
        replace : true,
        controller:'contentPhotoCo',
        scope: true,
        link: function(scope,element,attrs) {

            scope.resizeContent = function() {

                var container = angular.element(document.querySelector('.content_detalle .section'));

                var toResize    = angular.element(
                    element[0].querySelector('img.content_photo')  ||
                    element[0].querySelector('iframe')  || 
                    element[0].querySelector('object')   ||
                    element[0].querySelector('embed')
                );

                if ($window.innerWidth <= 480) {
                    return;
                }

                $(toResize[0]).css('width','').css('height','');
                $(container.parent()).css('width','').css('height','');

                var myWidth = angular.element(document.querySelector('.content_detalle')).width();

                var padding = parseInt($(container[0]).css('padding').replace('px','')) || 10;

                var myHeight= appSv.getMyWH() - padding;

                if (myHeight > container.height() && myWidth > container.width()) {
                    $(toResize[0]).css('max-width','100%');
                    $(toResize[0]).css('width','auto');
                    return;
                }

                var size = myHeight - toResize[0].offsetTop -padding -2;

                var currW= toResize.width();
                var currH= toResize.height();

                var ratio = currH / currW;
                if(currH >= size) {
                    currH = size;
                    currW = Math.ceil(currH / ratio);

                    var maxW = (currW > container.width()) ? currW : container.width() ; 
                    $(container.parent()[0]).css('width',maxW);
                    $(toResize[0]).css('width','auto');
                    $(toResize[0]).css('height',currH + 'px');
                } else if(currW >= size && ratio <= 1){
                    currW = size;
                    currH = Math.ceil(currW * ratio);

                    var maxH = (currH > container.height()) ? currH : container.height() ;
                    $(container.parent()[0]).css('height',maxH);
                    $(toResize[0]).css('width',currW + 'px');
                    $(toResize[0]).css('height','auto');
                }

            }

            scope.appSv = appSv;
            scope.$watch('appSv.getMyWH()', function(newValue, oldValue) {
                imagesLoaded(element[0],function(){
                    scope.resizeContent();
                });
            });

            scope.$watch('current.src', function(newValue, oldValue) {
                if (!angular.equals(newValue,oldValue)) {
                    imagesLoaded(element[0],function(){
                        scope.resizeContent();
                    });
                }
            },true);

        }
    }

}]);

ayTemaDs.directive('contentDetailTrack',['appSv','$window',
function(appSv,$window){
    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/detail/track.html',
        restrict : 'E',
        replace : true,
        controller:'contentTrackCo',
        scope: true,
        link: function(scope,element,attrs) {

            scope.resizeContent = function() {

                var container = angular.element(document.querySelector('.content_detalle .section'));

                var toResize    = angular.element(
                    element[0].querySelector('iframe')  || 
                    element[0].querySelector('object')  ||
                    element[0].querySelector('embed')
                );

                var player      = angular.element(element[0].querySelector('.player'));
                $(toResize[0]).css('opacity','0').css('height','').css('width','');

                console.log(toResize.width(),toResize.height());

                var myWidth = element.width();
                var padding = parseInt($(container[0]).css('padding').replace('px','')) || 10;

                if ($window.innerWidth <= 480) {
                    console.log("WIDTH");
                    //var myHeight = toResize.height() +2*padding +2;
                    var myHeight = toResize.height();
                    var currW= toResize.width();
                    var currH= toResize.height();
                    var ratio = currH / currW;
                    var myRatio = myWidth / myHeight ;

                    currW = myWidth;
                    if(ratio <= 1){
                        currH = Math.ceil(currW * ratio);
                    } else {
                        currH = Math.ceil(currW / ratio);
                    }

                    console.log("myW ",myWidth,myHeight);
                    console.log("original ratio ",ratio,toResize.width(),toResize.height());
                    console.log("END ",currW / currH,currW,currH);

                } else {
                    console.log("HEIGHT");
                    var myHeight= appSv.getMyWH() - toResize[0].offsetTop - 2*padding -2;
                    var currW= toResize.width();
                    var currH= toResize.height();
                    var ratio = currH / currW;
                    var myRatio = myHeight / myWidth;

                    currH = myHeight;
                    currW = currH / myRatio;

                    console.log("myW ",myWidth,myHeight);
                    console.log("original ratio ",ratio,toResize.width(),toResize.height());
                    console.log("END ",currH / currW,currW,currH);                    
                }

                $(toResize[0]).css('height',currH+'px').css('width',currW+'px').css('opacity','1');
                //$(player[0]).css('height',myHeight+'px');
            }

            scope.appSv = appSv;
            scope.$watch('appSv.getMyWH()', function(newValue, oldValue) {
                imagesLoaded(element[0],function(){
                    scope.resizeContent();
                });
            });

            scope.$watch('current.src', function(newValue, oldValue) {
                if (!angular.equals(newValue,oldValue)) {
                    imagesLoaded(element[0],function(){
                        scope.resizeContent();
                    });
                }
            },true);

        }
    }

}]);

ayTemaDs.directive('contentDetailChat',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/detail/chat.html',
        restrict : 'E',
        replace : true,
        controller:'contentChatCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentDetailQuote',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/detail/quote.html',
        restrict : 'E',
        replace : true,
        controller:'contentQuoteCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentDetailPost',['$FB','$timeout','appSv','$window',
function($FB,$timeout,appSv,$window){
    return {
        templateUrl : getPath('tpl')+'/themes/digest/detail/post.html',
        restrict : 'E',
        replace : true,
        controller:'contentPostCo',
        scope: true,
        link: function(scope,element,attrs) {

            if (scope.isFromNetwork('facebook')) {
                element.ready(function(){
                    $timeout(function(){
                        scope.$FB = $FB;
                        scope.$apply();
                        scope.$watch('$FB.loaded',function(value) {
                            // It needs authentication, this won't work.
                            if(value){
                                if (typeof $FB  != "undefined"){
                                    $FB.XFBML.parse($('#'+element[0].id+' .fb_iframe_widget').get(0));
                                }
                            }
                        },true);
                        scope.$apply();
                    },0);
                });
            }

            scope.resizeContent = function() {

                var container = angular.element(document.querySelector('.content_detalle .section'));
                var padding = parseInt($(container[0]).css('padding').replace('px','')) || 10;
                var myHeight= appSv.getMyWH() - 2*padding -2;

                $(element[0]).css('height','').css('overflow-y','');

                if ($window.innerWidth <= 480) {
                    return;
                }

                if (element.height() > myHeight) {
                    $(element[0]).css('height',myHeight+'px');
                    $(element[0]).css('overflow-y','auto');
                }
            }

            if (!scope.isFromNetwork('facebook')) {
                scope.appSv = appSv;
                scope.$watch('appSv.getMyWH()', function(newValue, oldValue) {
                    imagesLoaded(element[0],function(){
                        scope.resizeContent();
                    });
                });

                scope.$watch('current.src', function(newValue, oldValue) {
                    if (!angular.equals(newValue,oldValue)) {
                        imagesLoaded(element[0],function(){
                            scope.resizeContent();
                        });
                    }
                },true);
            }


        } 
    }

}]);