ayTemaDs.directive('adminColors',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/colors.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'adminColorsCo'
    }

}]);