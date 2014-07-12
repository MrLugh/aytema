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

    $routeProvider.when('/', {
    	templateUrl: getPath('tpl')+'/index.html',
    	controller: appCo,
    	reloadOnSearch: false
    });

    $routeProvider.when('/accounts', {
    	templateUrl: getPath('tpl')+'/index.html',
    	controller: appCo,
    	reloadOnSearch: false
    });

    $routeProvider.when('/themes', {
    	templateUrl: getPath('tpl')+'/index.html',
    	controller: appCo,
    	reloadOnSearch: false
    });
    
    $routeProvider.otherwise({redirectTo: '/'});
}]);

ayTemaApp.run([function(){}]);