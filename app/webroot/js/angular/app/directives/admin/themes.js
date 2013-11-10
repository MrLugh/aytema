ayTemaDs.directive('adminThemes',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/themes.html',
        restrict : 'E',
        replace : true,
        controller:'adminThemesCo'
    }

}]);