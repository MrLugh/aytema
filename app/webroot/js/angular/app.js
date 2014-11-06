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
    	templateUrl: getPath('tpl')+'/admin/dashboard.html',
    	controller: appCo,
    	reloadOnSearch: false
    });

    /*
    $routeProvider.when('/dashboard', {
    	templateUrl: getPath('tpl')+'/admin/dashboard.html',
    	controller: appCo,
    	reloadOnSearch: false
    });

    $routeProvider.when('/dashboard/accounts', {
    	templateUrl: getPath('tpl')+'/admin/dashboard.html',
    	controller: appCo,
    	reloadOnSearch: false
    });

    $routeProvider.when('/dashboard/themes', {
    	templateUrl: getPath('tpl')+'/admin/dashboard.html',
    	controller: appCo,
    	reloadOnSearch: false
    });

    $routeProvider.when('/dashboard/stats', {
        templateUrl: getPath('tpl')+'/admin/dashboard.html',
        controller: appCo,
        reloadOnSearch: false
    });

    $routeProvider.when('/', {
        templateUrl: getPath('tpl')+'/index.html',
        controller: cloudcialCo,
        reloadOnSearch: false
    });

	*/

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

ayTemaApp.factory('myHttpInterceptor', function ($q, $window) {
    return function (promise) {
        return promise.then(function (response) {
            $("#cloudcial_loading").fadeOut(1500);
            return response;
        }, function (response) {
            $("#cloudcial_loading").fadeOut(1500);
            return $q.reject(response);
        });
    };
});

ayTemaApp.run([function(){}]);