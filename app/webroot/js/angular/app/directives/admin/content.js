ayTemaDs.directive('adminContentVideo',['$FB','$timeout','appSv','$window',
function($FB,$timeout,appSv,$window){
    return {
        templateUrl : getPath('tpl')+'/admin/video.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentVideoCo',
        scope: true,
        link: function(scope,element,attrs) {

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

