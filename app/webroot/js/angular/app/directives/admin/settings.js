ayTemaDs.directive('adminSettings',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/settings.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'adminSettingsCo'
    }

}]);