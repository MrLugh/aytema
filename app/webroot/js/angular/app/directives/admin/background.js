ayTemaDs.directive('adminBackground',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/background.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'adminBackgroundCo'
    }

}]);