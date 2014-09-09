ayTemaDs.directive('contentVideo',['$FB','$timeout','appSv','$window',
function($FB,$timeout,appSv,$window){
    return {
        templateUrl : getPath('tpl')+'/themes/dj/video.html',
        restrict : 'E',
        replace : true,
        controller:'contentVideoCo',
        scope: true,
        link: function(scope,element,attrs) {

        } 
    }

}]);

ayTemaDs.directive('contentPhoto',['appSv','$window','$timeout',
function(appSv,$window,$timeout){
    return {
        templateUrl : getPath('tpl')+'/themes/dj/photo.html',
        restrict : 'E',
        replace : true,
        controller:'contentPhotoCo',
        scope: true,
        link: function(scope,element,attrs) {

            element.ready(function(){
                var loaded = 0;
                var images = [];
                for(var x in scope.photolist) {
                    images[x] = new Image();
                    images[x].src = scope.photolist[x].src;
                    $(images[x]).load(function(){
                        loaded++;
                        if (loaded == scope.photolist.length) {
                            scope.$apply(scope.loaded = true);
                        }
                    });
                }
            });

        }
    }

}]);

ayTemaDs.directive('contentTrack',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/dj/track.html',
        restrict : 'E',
        replace : true,
        controller:'contentTrackCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentChat',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/dj/chat.html',
        restrict : 'E',
        replace : true,
        controller:'contentChatCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentQuote',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/dj/quote.html',
        restrict : 'E',
        replace : true,
        controller:'contentQuoteCo',
        scope: true        
    }

}]);

ayTemaDs.directive('contentPost',['$FB','$timeout',
function($FB,$timeout){    
    return {
        templateUrl : getPath('tpl')+'/themes/dj/post.html',
        restrict : 'E',
        replace : true,
        controller:'contentPostCo',
        scope: true,
        link: function(scope,element,attrs) {

        } 
    }

}]);

ayTemaDs.directive('contentLink',['appSv','$window',
function(appSv,$window){
    
    return {
        templateUrl : getPath('tpl')+'/themes/dj/link.html',
        restrict : 'E',
        replace : true,
        controller:'contentLinkCo',
        scope: true
    }

}]);

ayTemaDs.directive('contentEvent',['appSv','$window',
function(appSv,$window){
    
    return {
        templateUrl : getPath('tpl')+'/themes/dj/event.html',
        restrict : 'E',
        replace : true,
        controller:'contentEventCo',
        scope: true
    }

}]);