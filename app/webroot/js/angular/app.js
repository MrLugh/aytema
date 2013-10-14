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

ayTemaApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider.when('/',
        {
            templateUrl:    getPath('tpl')+'/home.html',
            controller:     'HomeCtrl',
            access:         access.user
        });
    $routeProvider.when('/login',
        {
            templateUrl:    getPath('tpl')+'/login.html',
            controller:     'LoginCtrl',
            access:         access.anon
        });
    $routeProvider.when('/register',
        {
            templateUrl:    getPath('tpl')+'/register.html',
            controller:     'RegisterCtrl',
            access:         access.anon
        });
    $routeProvider.when('/private',
        {
            templateUrl:    getPath('tpl')+'/private.html',
            controller:     'PrivateCtrl',
            access:         access.user
        });
    $routeProvider.when('/admin',
        {
            templateUrl:    getPath('tpl')+'/admin.html',
            controller:     'AdminCtrl',
            access:         access.admin
        });
    $routeProvider.when('/404',
        {
            templateUrl:    getPath('tpl')+'/404.html',
            access:         access.public
        });
    $routeProvider.otherwise({redirectTo:'/404'});

    $locationProvider.html5Mode(true);

    var interceptor = ['$location', '$q', function($location, $q) {
        function success(response) {
            return response;
        }

        function error(response) {

            if(response.status === 401) {
                $location.path('/login');
                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        }

        return function(promise) {
            return promise.then(success, error);
        }
    }];

    $httpProvider.responseInterceptors.push(interceptor);

}]);

ayTemaApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.error = null;
        if (!Auth.authorize(next.access)) {
            if(Auth.isLoggedIn()) {$location.path('/');}
            else {$location.path('/login');}
        }
    });
}]);