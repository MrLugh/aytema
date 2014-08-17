ayTemaDs.directive('adminAccounts',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/accounts.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'adminAccountsCo'
    }

}]);