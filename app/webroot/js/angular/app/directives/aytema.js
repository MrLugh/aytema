ayTemaDs.directive('aytema',[function(){
	
    return {
        templateUrl : getPath('tpl')+'/app.html',
        restrict : 'E',
        replace : true,
        controller:'aytemaCo',
    }

}]);

ayTemaDs.directive('user',['userSv',
function($userSv) {
    return function(scope, elm, attrs) {

        var user = attrs.user;
        user =  eval("(function(){return " + user + ";})()");
        $userSv.setUser(user);
    }
}]);
