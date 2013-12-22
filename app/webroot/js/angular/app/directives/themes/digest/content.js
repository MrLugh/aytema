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

ayTemaDs.directive('contentDetailVideo',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/detail/video.html',
        restrict : 'E',
        replace : true,
        controller:'contentVideoCo',
        scope: true
    }

}]);


ayTemaDs.directive('contentDetailPhoto',['appSv',
function (appSv) { 
    return {
        templateUrl : getPath('tpl')+'/themes/digest/detail/photo.html',
        restrict : 'E',
        replace : true,
        controller:'contentPhotoCo',
        scope: true,
        link: function(scope,element,attrs) {

            scope.resizeContent = function() {

                var container = angular.element(document.querySelector('.content_detalle .section'));

                var toResize   = angular.element(
                    element[0].querySelector('img.content_photo') || element[0].querySelector('iframe')
                );
                $(toResize[0]).css('width','').css('height','');
                $(container.parent()).css('width','').css('height','');

                var myWidth = angular.element(document.querySelector('.content_detalle')).width();

                var padding = parseInt($(container[0]).css('padding').replace('px',''));
                //var myHeight= appSv.getMyWH() - padding;
                var myHeight= appSv.getMyWH();

                if (myHeight > container.height() && myWidth > container.width()) {
                    console.log("Entra perfecto!");
                    return;
                }

                $(toResize[0]).css('opacity',0);

                console.log("Trato de resizear");

                console.log("MyWindow ",myWidth,myHeight);
                console.log("Container ",container.width(),container.height(),container.offsetHeight);
                console.log("Element ",element.width(),element.height());

                console.log("toResize ",toResize.width(),toResize.height(),toResize[0].offsetTop);

                var size = myHeight - toResize[0].offsetTop -padding -2;

                console.log("Restrict height to ",size);

                var currW= toResize.width();
                var currH= toResize.height();
                var ratio= 0;

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

                $(toResize[0]).css('opacity',1);
                console.log("End ",currW,currH);
            }

            scope.appSv = appSv;
            scope.$watch('appSv.getMyWH()', function(newValue, oldValue) {
                imagesLoaded(element[0],function(){
                    scope.resizeContent()
                });
            });

            scope.$watch('current', function(newValue, oldValue) {
                imagesLoaded(element[0],function(){
                    scope.resizeContent()
                });
            });

        }         
    }

}]);

ayTemaDs.directive('contentDetailTrack',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/detail/track.html',
        restrict : 'E',
        replace : true,
        controller:'contentTrackCo',
        scope: true        
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

ayTemaDs.directive('contentDetailPost',['$FB','$timeout',
function($FB,$timeout){    
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
        } 
    }

}]);