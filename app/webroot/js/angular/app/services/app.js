ayTemaSs.factory('appSv',['$q', '$http',function($q,$http){

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
	};

	return {

		getNetworks: function() {
			return networks;
		}
	}

}]);