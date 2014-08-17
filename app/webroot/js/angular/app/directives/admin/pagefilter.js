ayTemaDs.directive('adminPagefilter',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/admin/pagefilter.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'adminPagefilterCo'
    }

}]);