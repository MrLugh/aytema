ayTemaDs.directive('adminShare',['$window',
function ($window) {
    return {
        templateUrl : getPath('tpl')+'/admin/share.html',
        restrict : 'E',
        replace : true,
        controller:'adminShareCo',
        link: function(scope,element,attrs) {

        }
    }

}]);