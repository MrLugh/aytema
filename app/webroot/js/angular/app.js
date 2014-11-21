'use strict';

var ayTemaApp = angular.module('ayTemaApp',[
	'ayTema.controllers',
	'ayTema.services',
	'ayTema.directives',
	'ayTema.filters',
	'ngRoute',
    'ngResource',
	'ngAnimate',
	'ngLocale',
	'ngSanitize',
	'ngTouch',
	'ngCookies',
	'ui.bootstrap',
    'ui.tinymce'
]);

ayTemaApp.config(['$routeProvider','$httpProvider','$sceDelegateProvider',
function($routeProvider,$httpProvider,$sceDelegateProvider) {

  $sceDelegateProvider.resourceUrlWhitelist(['^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?\(vimeo|youtube|facebook|mixcloud|twitter|soundcloud|cloudcial)\.com(/.*)?$', 'self']);

    $routeProvider.when('/', {
        templateUrl: getPath('tpl')+'/app.html',
        controller: appCo,
        reloadOnSearch: false
    });

    /*
    $routeProvider.when('/sign', {
        templateUrl: getPath('tpl')+'/login.html',
        controller: loginCo,
        reloadOnSearch: false
    });
    */

    $routeProvider.when('/settings', {
        templateUrl: getPath('tpl')+'/admin/settings.html',
        controller: adminSettingsCo,
        reloadOnSearch: false
    });

    $routeProvider.when('/accounts', {
        templateUrl: getPath('tpl')+'/admin/accounts.html',
        controller: adminAccountsCo,
        reloadOnSearch: false
    });

    $routeProvider.when('/themes', {
        templateUrl: getPath('tpl')+'/admin/themes.html',
        controller: adminThemesCo,
        reloadOnSearch: false
    });

    $routeProvider.when('/stats', {
        templateUrl: getPath('tpl')+'/admin/stats.html',
        controller: adminStatsCo,
        reloadOnSearch: false
    });

    $routeProvider.when('/share', {
        templateUrl: getPath('tpl')+'/admin/share.html',
        controller: adminShareCo,
        reloadOnSearch: false
    });    

    /*
    $routeProvider.when('/users', {
        templateUrl: getPath('tpl')+'/cloudcial/users.html',
        controller: usersCo,
        reloadOnSearch: false
    });

    $routeProvider.when('/socialnets/:network/:external_user_id', {
        templateUrl: getPath('tpl')+'/cloudcial/socialnet.html',
        controller: socialnetCo,
        reloadOnSearch: false
    });

    $routeProvider.when('/socialnets', {
        templateUrl: getPath('tpl')+'/cloudcial/socialnets.html',
        controller: socialnetsCo,
        reloadOnSearch: false
    });
	*/

    
    $routeProvider.otherwise({redirectTo: '/'});
}]);

var spinner_timer = -1;

ayTemaApp.config(function ($httpProvider) {

    $httpProvider.responseInterceptors.push('myHttpInterceptor');

    var spinnerFunction = function spinnerFunction(data, headersGetter) {
        $("#cloudcial_loading").show();
        return data;
    };

    $httpProvider.defaults.transformRequest.push(spinnerFunction);
});

ayTemaApp.factory('myHttpInterceptor',['$q', '$location','$rootScope', function ($q, $location, $rootScope) {
    return function (promise) {
        return promise.then(
            function (response) {
                $("#cloudcial_loading").fadeOut(1500);
                return response;
            },
            function (response) {
                $("#cloudcial_loading").fadeOut(1500);
                if (response.status == 401) {
                    $rootScope.$broadcast("unauthorized");
                }
                return $q.reject(response);
            }
        );
    };
}]);

ayTemaApp.run(['$rootScope','$location','userSv',function($rootScope,$location,userSv){

    $rootScope.$on('$routeChangeStart', function (event, next) {
        $rootScope.currentPage = angular.copy($location.path()).replace("/","");
    });

}]);