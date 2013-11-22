var ayTemaFs = angular.module('ayTema.filters',[]);

ayTemaFs.filter('htmlToPlaintext', function() {
	return function(text) {
		if (text.length == 0) {
			return text;
		}
		return String(text).replace(/<(?:.|\n)*?>/gm, '');
	}
});