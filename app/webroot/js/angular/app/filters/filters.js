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

ayTemaFs.filter('unslug', function() {
	return function(input, scope) {
		return input.toLowerCase().replace(/-+/g,' ').replace(/\s+/g, ' ').replace(/[^a-z0-9-]/g, ' ');
	}
});

ayTemaFs.filter('statValueFormat', function() {
	return function(num, params) {

		num = parseFloat(num);

		if( isNaN(num) ){
			return 0;
		}

		var THOUSAND = 1000;
		var MILLION = 1E6;
		var BILLION = 1E9;

		var result;
		var significantFigures;
		var currencySymbol;
		var autoFormatDecimals;
		var round;
		var abbrev = '';

		if (params) {
			significantFigures = params.significantFigures === 0 ? undefined : params.significantFigures;
			currencySymbol = params.currencySymbol;
			round = params.round;
			autoFormatDecimals = params.autoFormatDecimals === true; //use this flag to remove the zero decimals. I.E. 2.40M -> 2.4M
		}		

		if (num < 1 && num > 0) {
			autoFormatDecimals = true;
			result = num.toFixed(significantFigures);

		} else if (num < THOUSAND) {
			if (currencySymbol) {
				result = num.toFixed(significantFigures);
			}
			else {
				result = num.toPrecision(significantFigures);
			}
		} else if (num < MILLION) {
			result = (num / THOUSAND).toPrecision(significantFigures);
			abbrev = 'K';
		} else if (num < BILLION) {
			result = (num / MILLION).toPrecision(significantFigures);
			abbrev = 'M';
		} else {
			result = (num / BILLION).toPrecision(significantFigures);
			abbrev = 'B';
		}

		if(round) {
			result = Math.round(Number(result));
		}

		if(autoFormatDecimals) {
			result = parseFloat(result);
		}

		if (currencySymbol) {
			result = currencySymbol += result;
		}
		
		return result + abbrev;
	}
});