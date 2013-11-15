ayTemaDs.directive('adminContentVideo',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/video.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentVideoCo',
        scope: false
    }

}]);


ayTemaDs.directive('adminContentPhoto',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/photo.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentPhotoCo',
        scope: false        
    }

}]);

ayTemaDs.directive('adminContentTrack',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/track.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentTrackCo',
        scope: false        
    }

}]);

ayTemaDs.directive('adminContentChat',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/chat.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentChatCo',
        scope: false        
    }

}]);

ayTemaDs.directive('adminContentQuote',[function(){
    
    return {
        templateUrl : getPath('tpl')+'/admin/quote.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentQuoteCo',
        scope: false        
    }

}]);

ayTemaDs.directive('adminContentPost',['$FB','$timeout',
function($FB,$timeout){    
    return {
        templateUrl : getPath('tpl')+'/admin/post.html',
        restrict : 'E',
        replace : true,
        controller:'adminContentPostCo',
        scope: false,
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