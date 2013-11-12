ayTemaDs.directive('adminAccount',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/account.html',
        restrict : 'E',
        replace : true,
        controller:'adminAccountCo'
    }

}]);