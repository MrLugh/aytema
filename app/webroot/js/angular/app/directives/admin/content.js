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

ayTemaDs.directive('adminAddPhoto',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/add/photo.html',
        restrict : 'E',
        replace : true,
        controller:'adminAddPhotoCo',
        scope: true
    }

}]);

ayTemaDs.directive('adminAddTrack',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/add/track.html',
        restrict : 'E',
        replace : true,
        controller:'adminAddTrackCo',
        scope: true
    }

}]);

ayTemaDs.directive('adminAddVideo',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/add/video.html',
        restrict : 'E',
        replace : true,
        controller:'adminAddVideoCo',
        scope: true
    }

}]);

ayTemaDs.directive('adminAddPost',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/add/post.html',
        restrict : 'E',
        replace : true,
        controller:'adminAddPostCo',
        scope: true
    }

}]);