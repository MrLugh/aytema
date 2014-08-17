ayTemaDs.directive('adminWidth',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/width.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'adminWidthCo'
    }

}]);