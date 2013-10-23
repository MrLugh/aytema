ayTemaDs.directive('login',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/login.html',
        restrict : 'E',
        replace : true,
        controller:'loginCo'
    }

}]);