ayTemaDs.directive('contentVideo',['$FB','$timeout','appSv','$window',
function($FB,$timeout,appSv,$window){
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/video.html',
        restrict : 'E',
        replace : true,
        controller:'contentVideoCo',
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

ayTemaDs.directive('contentPhoto',['appSv','$window','$timeout',
function(appSv,$window,$timeout){
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/photo.html',
        restrict : 'E',
        replace : true,
        controller:'contentPhotoCo',
        link: function(scope,element,attrs) {

        }         
    }

}]);

ayTemaDs.directive('contentTrack',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/track.html',
        restrict : 'E',
        replace : true,
        controller:'contentTrackCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentChat',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/chat.html',
        restrict : 'E',
        replace : true,
        controller:'contentChatCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentQuote',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/quote.html',
        restrict : 'E',
        replace : true,
        controller:'contentQuoteCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentPost',['$FB','$timeout',
function($FB,$timeout){    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/post.html',
        restrict : 'E',
        replace : true,
        controller:'contentPostCo',
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

ayTemaDs.directive('contentLink',['appSv','$window',
function(appSv,$window){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/link.html',
        restrict : 'E',
        replace : true,
        controller:'contentLinkCo',
        scope: true
    }

}]);

ayTemaDs.directive('contentEvent',['appSv','$window',
function(appSv,$window){
    
    return {
        templateUrl : getPath('tpl')+'/themes/clubber/event.html',
        restrict : 'E',
        replace : true,
        controller:'contentEventCo',
        scope: true
    }

}]);