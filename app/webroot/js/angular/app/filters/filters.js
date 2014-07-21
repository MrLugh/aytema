var ayTemaFs = angular.module('ayTema.filters',[]);

ayTemaFs.filter('networkBrand', function(appSv) {
	return function(network) {
		if (angular.isDefined(appSv.getNetworks()[network])) {
			return appSv.getNetworks()[network]['brand'];
		}
		return '';
	}
});

ayTemaFs.filter('capitalize', function() {
	return function(input, scope) {
		if (input!=null) {
			input = input.toLowerCase();
		}
		return input.substring(0,1).toUpperCase()+input.substring(1);
	}
});