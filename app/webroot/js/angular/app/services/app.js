ayTemaSs.factory('appSv',['$q', '$http',function($q,$http) {

    var winW = 0;
    var winH = 0;
    var myWH = 0;

    var navigationMode = 0;
    var dashboardMenuMode = 0;

	var networks = {
		'cloudcial'	: {
			network : 'cloudcial',
			brand 	: "CloudCial",
			concepts: ['event','photo','video','track','post'],
			oauth	: false,
			follow	: false,
		},
		'facebook' : {
			network : 'facebook',
			brand	:'FaceBook',
			concepts: ['post','photo','video'],
			oauth	: true,
			follow	: true,
		},
		'twitter' : {
			network : 'twitter',
			brand	:'Twitter',
			concepts: ['post'],
			oauth	: true,
			follow	: true,
		},
		'tumblr' : {
			network : 'tumblr',
			brand	:'Tumblr',
			concepts: ['photo','video','track','post','quote','chat','link'],
			oauth	: true,
			follow	: true,
		},
		'soundcloud' : {
			network : 'soundcloud',			
			brand	:'SoundCloud',
			concepts: ['track'],
			oauth	: true,
			follow	: true,
		},
		'mixcloud' : {
			network : 'mixcloud',
			brand	:'MixCloud',
			concepts: ['track'],
			oauth	: false,
			follow	: true,
		},
		'vimeo' : {
			network : 'vimeo',
			brand	:'Vimeo',
			concepts: ['video'],
			oauth	: true,
			follow	: true,
		},
		'youtube' : {
			network : 'youtube',
			brand	:'YouTube',
			concepts: ['video'],
			oauth	: true,
			follow	: false,
		},
	};

	var pluralizedConcepts = {
		photo:'photos',
		video:'videos',
		post:'posts',
		track:'tracks',
		quote:'quotes',
		link:'links',
		chat:'chats'
	};

	var sizes = ['small','medium','large','xlarge'];

	var appIds = {
		'facebook' : {
			id : '211895592326072',
		},
		'twitter' : {
			id : 'l9e7aSs4BVet4Oryv7QsGw',
		},
		'tumblr' : {
			id : 'TyJKAYXQm61AsADJ8vpgGLoPcwxpme8LzWaOfRvYGLJeRQ31Az',
		},
		'soundcloud' : {
			id : 'b0b6e1bfc6ac107fe7804f0dd6083538',
		},
		'mixcloud' : {
			id : 'XvjV23U8zawTxMp368',
		},
		'vimeo' : {
			id : 'b6faa32ad34bfdfad0f3a53d39d0ec25a4d18cb7',
		},
		'youtube' : {
			id : 'AIzaSyDgE0KcEAKdRQl9IReB4E7ZBZpQOL2Cxz8',
		},
	};

	var themes = [
		{
			'name'		: 'Digest',
			'key'		: 'digest',
			'thumbnails': [
				getPath('img')+'/themes/digest/digest_theme_01.png',
				getPath('img')+'/themes/digest/digest_theme_02.png',
				getPath('img')+'/themes/digest/digest_theme_03.png'
			]
		},
		{
			'name'		: 'Simple',
			'key'		: 'simple',			
			'thumbnails': [
				getPath('img')+'/themes/simple/simple_theme_01.png',
				getPath('img')+'/themes/simple/simple_theme_02.png',
				getPath('img')+'/themes/simple/simple_theme_03.png',
			]
		},
		{
			'name'		: 'Space',
			'key'		: 'space',			
			'thumbnails': [
				getPath('img')+'/themes/space/space_theme_01.png',
				getPath('img')+'/themes/space/space_theme_02.png',
				getPath('img')+'/themes/space/space_theme_03.png',
				getPath('img')+'/themes/space/space_theme_04.png',
				getPath('img')+'/themes/space/space_theme_05.png',
			]
		},
		{
			'name'		: 'Clubber',
			'key'		: 'clubber',
			'thumbnails': [
				getPath('img')+'/themes/clubber/clubber_theme_01.png',
				getPath('img')+'/themes/clubber/clubber_theme_02.png',
				getPath('img')+'/themes/clubber/clubber_theme_03.png',
				getPath('img')+'/themes/clubber/clubber_theme_04.png',
				getPath('img')+'/themes/clubber/clubber_theme_05.png',
				getPath('img')+'/themes/clubber/clubber_theme_06.png',
				getPath('img')+'/themes/clubber/clubber_theme_07.png',
				getPath('img')+'/themes/clubber/clubber_theme_08.png',
				getPath('img')+'/themes/clubber/clubber_theme_09.png',
			]
		},
	];

	return {

		getNetworks: function() {
			return networks;
		},
		getThemes: function() {
			return themes;
		},
		setDashboardMenuMode: function(mode) {
        	dashboardMenuMode = mode;
        },
		getDashboardMenuMode: function() {
        	return dashboardMenuMode;
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
    	},
    	getAppIds: function(network,typeId) {
    		//console.log("getAppIds ",network,typeId,appIds);
    		return appIds[network][typeId];
    	},
    	getContentSizes: function() {
    		return sizes;
    	},
    	setMyWH: function(height) {
    		myWH = height;
    	},
    	getMyWH: function() {
    		return myWH;
    	},
    	getPluralizedConcepts: function() {
    		return pluralizedConcepts;
    	},
    	getNavigationMode: function() {
    		return navigationMode;
    	},
    	setNavigationMode: function(mode) {
    		navigationMode = mode;
    	}    	
	}

}]);

ayTemaSs.factory('$FB', ['$rootScope', function($rootScope) {
	var fbLoaded = false;
	// Our own customisations
	var _fb = {
		loaded: fbLoaded,
		_init: function(params) {
			if(window.FB) {
				// FIXME: Ugly hack to maintain both window.FB
				// and our AngularJS-wrapped $FB with our customisations
				angular.extend(window.FB, _fb);
				angular.extend(_fb, window.FB);
				// Set the flag
				_fb.loaded = true;
				// Initialise FB SDK
				window.FB.init(params);
				if(!$rootScope.$$phase) {
					$rootScope.$apply();
				}
			}
		}
	}
	return _fb;
}]);