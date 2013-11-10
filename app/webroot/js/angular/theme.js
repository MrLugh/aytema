'use strict';

var ayTemaThemeApp = angular.module('ayTemaThemeApp',['ayTema.controllers','ayTema.services','ayTema.directives','ayTema.filters','ngRoute','ngAnimate','ngLocale','ngSanitize','ngTouch','ngCookies']);

ayTemaThemeApp.config(['$routeProvider','$httpProvider', function($routeProvider,$httpProvider) {
    $routeProvider.when('/theme/digest', {
    	templateUrl: getPath('tpl')+'/themes/digest/index.html', controller: themeDigestCo
    });
    
    $routeProvider.otherwise({redirectTo: '/theme/digest'});
}]);

ayTemaThemeApp.run([function(){}]);