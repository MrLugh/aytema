ayTemaDs.directive('adminContentVideo',['$FB','$timeout','appSv','$window',
function($FB,$timeout,appSv,$window){
    return {
        templateUrl : getPath('tpl')+'/admin/video.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentVideoCo',
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

                if (scope.isFromNetwork('facebook') || scope.isFromNetwork('twitter')) {
                    return;
                }

                var maxheight = 300;

                var container = element;

                var toResize    = angular.element(
                    element[0].querySelector('iframe')  ||
                    element[0].querySelector('object')  ||
                    element[0].querySelector('embed')
                );

                if (toResize.length == 0) {
                    return;
                }

                var originalW = toResize.width();
                var originalH = toResize.height();
                $(toResize[0]).css('opacity','0').css('height','0px').css('width','0px');

                var myWidth = element.width();
                var padding = parseInt($(container[0]).css('padding').replace('px','')) || 10;

                var myHeight= maxheight - (element.find('h2')[0].offsetTop || 0) - 2*padding -2;
                var currW= originalW;
                var currH= originalH;
                var ratio = currH / currW;
                var myRatio = myWidth / myHeight ;

                currW = myWidth;
                if(ratio <= 1){
                    currH = Math.ceil(currW * ratio);
                } else {
                    currH = Math.ceil(currW / ratio);
                }
                $(toResize[0]).css('height',currH+'px').css('width',currW+'px').css('opacity','1');
            }

            scope.appSv = appSv;
            scope.$watch('appSv.getMyWH()', function(newValue, oldValue) {
                scope.resizeContent();
            });

            element.ready(function(){
                imagesLoaded(element[0],function(){
                    scope.resizeContent();
                });
            });
        } 
    }

}]);

ayTemaDs.directive('adminContentPhoto',['appSv','$window','$timeout',
function(appSv,$window,$timeout){
    return {
        templateUrl : getPath('tpl')+'/admin/photo.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentPhotoCo',
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

                var maxheight = 300;

                var container = element;

                var toResize    = angular.element(element[0].querySelector('img'));

                if (toResize.length == 0) {
                    return;
                }

                var originalW = toResize.width();
                var originalH = toResize.height();
                $(toResize[0]).css('opacity','0').css('height','0px').css('width','0px');

                var myWidth = element.width();
                var padding = parseInt($(container[0]).css('padding').replace('px','')) || 10;

                var myHeight= maxheight - (element.find('h2')[0].offsetTop || 0) - 2*padding -2;
                var currW= originalW;
                var currH= originalH;
                var ratio = currH / currW;
                var myRatio = myWidth / myHeight ;

                currW = myWidth;
                if(ratio <= 1){
                    currH = Math.ceil(currW * ratio);
                } else {
                    currH = Math.ceil(currW / ratio);
                }
                $(toResize[0]).css('height',currH+'px').css('width','auto').css('opacity','1');
            }

            /*
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

            element.ready(function(){
                imagesLoaded(element[0],function(){
                    scope.resizeContent();
                });
            });
            */

        }         
    }

}]);

ayTemaDs.directive('adminContentTrack',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/track.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentTrackCo',
        scope: true        
    }

}]);

ayTemaDs.directive('adminContentChat',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/chat.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentChatCo',
        scope: true        
    }

}]);

ayTemaDs.directive('adminContentQuote',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/quote.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentQuoteCo',
        scope: true        
    }

}]);

ayTemaDs.directive('adminContentPost',['$FB','$timeout',
function($FB,$timeout){    
    return {
        templateUrl : getPath('tpl')+'/admin/post.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentPostCo',
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

ayTemaDs.directive('adminContentLink',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/link.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentLinkCo',
        scope: true
    }

}]);

ayTemaDs.directive('adminContentEvent',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/event.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentEventCo',
        scope: true
    }

}]);


ayTemaDs.directive('adminAddEvent',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/add/event.html',
        restrict : 'E',
        replace : true,
        controller:'adminAddEventCo',
        scope: true
    }

}]);

