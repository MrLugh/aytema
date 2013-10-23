ayTemaDs.directive('aytema',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/app.html',
        restrict : 'E',
        replace : true,
        controller:'aytemaCo',
    }

}]);