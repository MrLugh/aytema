ayTemaDs.directive('aytema',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/app.html',
        restrict : 'E',
        replace : true,
        scope: true,
        controller:'aytemaCo',
    }

}]);

ayTemaDs.directive('user',['userSv',
function(userSv) {
    return function(scope, elm, attrs) {

        scope.$watch('attrs.user',function(){
            var user = eval("(function(){return " + attrs.user + ";})()");
            if (!angular.equals(user,{})) {
                userSv.setUser(user);
            }
        });
    }
}]);
