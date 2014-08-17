ayTemaDs.directive('adminContentsize',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/contentsize.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'adminContentsizeCo'
    }

}]);