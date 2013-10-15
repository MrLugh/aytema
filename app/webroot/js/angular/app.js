'use strict';

var paths = {
	'tpl':'app/webroot/js/angular/app/templates',
	'ctl':'app/webroot/js/angular/app/controllers',
	'dir':'app/webroot/js/angular/app/directives',
	'ftr':'app/webroot/js/angular/app/filters',
	'svc':'app/webroot/js/angular/app/services'
}

function getPath(key) {
	return paths[key];
}


var ayTemaApp = angular.module('ayTemaApp',['ayTema.controllers','ayTema.services','ayTema.directives','ayTema.filters','ngRoute','ngAnimate','ngLocale','ngSanitize','ngTouch','ngCookies']);
