'use strict';

var ayTemaApp = angular.module('ayTemaApp',['ayTema.services','ayTema.directives','ayTema.filters','ngRoute','ngAnimate','ngLocale','ngSanitize','ngTouch']);

ayTemaApp.value('templatePath','app/webroot/js/angular/app/templates/');
ayTemaApp.value('controllerPath','app/webroot/js/angular/appcontrollers');
ayTemaApp.value('directivesPath','app/webroot/js/angular/appdirectives');
ayTemaApp.value('filtersPath','app/webroot/js/angular/appfilters');
ayTemaApp.value('servicesPath','app/webroot/js/angular/appservices');

ayTemaApp.controller('indexCo',indexCo);

ayTemaApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {templateUrl: 'app/webroot/js/angular/app/templates/index.html', controller: indexCo});
	$routeProvider.otherwise({redirectTo: '/'});
}]);