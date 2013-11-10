ayTemaSs.factory('appSv',['$q', '$http',function($q,$http) {

    var winW = 0;
    var winH = 0;	

	var networks = {
		'facebook' : {
			network : 'facebook',
			brand	:'FaceBook',
			concepts: ['post']
		},
		'twitter' : {
			network : 'twitter',
			brand	:'Twitter',
			concepts: ['post']
		},
		'tumblr' : {
			network : 'tumblr',			
			brand	:'Tumblr',
			concepts: ['photo','video','track','post','quote','chat','link']
		},
		'soundcloud' : {
			network : 'soundcloud',			
			brand	:'SoundCloud',
			concepts: ['track']
		},
		'mixcloud' : {
			network : 'mixcloud',
			brand	:'MixCloud',
			concepts: ['track']
		},
		'vimeo' : {
			network : 'vimeo',
			brand	:'Vimeo',
			concepts: ['video']
		},
		'youtube' : {
			network : 'youtube',
			brand	:'YouTube',
			concepts: ['video']
		},		
	};

	var themes = [
		{
			'name'		: 'Digest',
			'key'		: 'digest',
			'thumbnail'	: getPath('img')+'/themes/digest/thumb.png',
			'path'		: '#/theme?digest',
		},
		{
			'name'		: 'Disco',
			'key'		: 'disco',			
			'thumbnail'	: getPath('img')+'/themes/disco/thumb.png',
			'path'		: '#/theme?disco',
		},
		{
			'name'		: 'Clubber',
			'key'		: 'clubber',			
			'thumbnail'	: getPath('img')+'/themes/clubber/thumb.png',
			'path'		: '#/theme?clubber',
		},		
	];

	return {

		getNetworks: function() {
			return networks;
		},
		getThemes: function() {
			return themes;
		},
    	setWidth: function(value) {
        	winW = value;
        },
    	setHeight: function(value) {
    		winH = value;
    	},
    	getWidth: function() {
    		return winW;
    	},
    	getHeight: function() {
    		return winH;
    	},
    	getSize: function() {
    		return {w:winW,h:winH};
    	}
	}

}]);