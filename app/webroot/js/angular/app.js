'use strict';

var ayTemaApp = angular.module('ayTemaApp',['ayTema.controllers','ayTema.services','ayTema.directives','ayTema.filters','ngRoute','ngAnimate','ngLocale','ngSanitize','ngTouch','ngCookies']);

ayTemaApp.config(['$routeProvider','$httpProvider', function($routeProvider,$httpProvider) {
    $routeProvider.when('/', {
    	templateUrl: getPath('tpl')+'/index.html', controller: appCo
    });
    
    $routeProvider.otherwise({redirectTo: '/'});
}]);

ayTemaApp.run([function(){}]);