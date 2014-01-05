ayTemaDs.directive('themeDigest',[
function(){
    
    return {
        templateUrl : getPath('tpl')+'/themes/digest/index.html',
        restrict : 'E',
        replace : true,
        controller:'themeDigestCo',
        scope: true
    }

}]);