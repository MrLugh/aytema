var ayTemaFs = angular.module('ayTema.filters',[]);

ayTemaFs.filter('networkBrand', function(appSv) {
	return function(network) {
		if (angular.isDefined(appSv.getNetworks()[network])) {
			return appSv.getNetworks()[network]['brand'];
		}
		return '';
	}
});