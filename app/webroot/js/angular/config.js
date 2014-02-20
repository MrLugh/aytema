var paths = {
	'tpl':'app/webroot/js/angular/app/templates',
	'ctl':'app/webroot/js/angular/app/controllers',
	'dir':'app/webroot/js/angular/app/directives',
	'ftr':'app/webroot/js/angular/app/filters',
	'svc':'app/webroot/js/angular/app/services',
	'img':'app/webroot/img',
}

function getPath(key) {
	return 'http://cloudcial.com/' + paths[key];
}