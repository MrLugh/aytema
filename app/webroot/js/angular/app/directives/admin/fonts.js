ayTemaDs.directive('adminFonts',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/fonts.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'adminFontsCo'
    }

}]);