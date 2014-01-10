ayTemaDs.directive('themeSimple',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/simple/index.html',
        restrict : 'E',
        replace : true,
        controller:'themeSimpleCo',
        scope: true
    }

}]);