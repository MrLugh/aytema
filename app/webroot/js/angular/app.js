'use strict';

var ayTemaApp = angular.module('ayTemaApp',[
	'ayTema.controllers',
	'ayTema.services',
	'ayTema.directives',
	'ayTema.filters',
	'ngRoute',
	'ngAnimate',
	'ngLocale',
	'ngSanitize',
	'ngTouch',
	'ngCookies',
	'ui.bootstrap',
]);

ayTemaApp.config(['$routeProvider','$httpProvider','$sceDelegateProvider',
function($routeProvider,$httpProvider,$sceDelegateProvider) {

  $sceDelegateProvider.resourceUrlWhitelist(['^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?\(vimeo|youtube|facebook|mixcloud|twitter|soundcloud|cloudcial)\.com(/.*)?$', 'self']);

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

    $routeProvider.when('/', {
        templateUrl: getPath('tpl')+'/index.html',
        controller: cloudcialCo,
        reloadOnSearch: false
    });

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

//ayTemaApp.run([function(){}]);

ayTemaApp.run(function($rootScope, $location, $anchorScroll, $routeParams) {
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    $location.hash($routeParams.scrollTo);
    $anchorScroll();  
  });
});