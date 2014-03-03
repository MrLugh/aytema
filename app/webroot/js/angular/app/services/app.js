ayTemaSs.factory('appSv',['$q', '$http',function($q,$http) {

    var winW = 0;
    var winH = 0;
    var myWH = 0;

	var networks = {
		'cloudcial'	: {
			network : 'cloudcial',
			brand 	: "CloudCial",
			concepts: ['event','photo','video','track','post']
		},
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
			'thumbnails': {
				0:getPath('img')+'/themes/digest/digest.png',
				1:getPath('img')+'/themes/digest/digest-detail.png',
			}
		},
		{
			'name'		: 'Simple',
			'key'		: 'simple',			
			'thumbnails': {
				0:getPath('img')+'/themes/simple/simple.png',
				1:getPath('img')+'/themes/simple/simple-controls.png',
				2:getPath('img')+'/themes/simple/simple-player.png',
			}
		},
		{
			'name'		: 'Space',
			'key'		: 'space',			
			'thumbnails': {
				0:getPath('img')+'/themes/space/space.png',
				1:getPath('img')+'/themes/space/space-player.png',
			}
		},
		{
			'name'		: 'Clubber',
			'key'		: 'clubber',
			'thumbnails': {
				0:getPath('img')+'/themes/clubber/clubber.png',
			}
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