'use strict';

var ayTemaApp = angular.module('ayTemaApp',['ayTema.services','ayTema.directives','ayTema.filters','ngRoute','ngAnimate','ngLocale','ngSanitize','ngTouch']);

ayTemaApp.value('templatePath','js/app/templates/');
ayTemaApp.value('controllerPath','js/app/controllers');
ayTemaApp.value('directivesPath','js/app/directives');
ayTemaApp.value('filtersPath','js/app/filters');
ayTemaApp.value('servicesPath','js/app/services');

ayTemaApp.controller('indexCo',indexCo);

ayTemaApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {templateUrl: 'js/app/templates/index.html', controller: indexCo});
	$routeProvider.otherwise({redirectTo: '/'});
}]);