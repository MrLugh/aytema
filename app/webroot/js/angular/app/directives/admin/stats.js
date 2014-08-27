ayTemaDs.directive('adminStats',['$window',
function ($window) {
    return {
        templateUrl : getPath('tpl')+'/admin/stats.html',
        restrict : 'E',
        replace : true,
        controller:'adminStatsCo',
        link: function(scope,element,attrs) {

        }
    }

}]);