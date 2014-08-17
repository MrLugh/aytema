'use strict';

var ayTemaThemeApp = angular.module('ayTemaThemeApp',[
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

ayTemaThemeApp.config(['$routeProvider','$httpProvider', function($routeProvider,$httpProvider) {

    $routeProvider.when('/', {
    	templateUrl: getPath('tpl')+'/themes/index.html', controller: themesCo
    });
    
    $routeProvider.otherwise({redirectTo: '/'});
}]);

ayTemaThemeApp.run([function(){}]);