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