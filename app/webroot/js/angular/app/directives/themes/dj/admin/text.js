ayTemaDs.directive('adminText',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/themes/dj/admin/text.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'adminTextCo'
    }

}]);