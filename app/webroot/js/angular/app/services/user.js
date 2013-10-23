ayTemaSs.factory('userSv',['$q', '$http',function($q,$http){

	//var user = false;
	var user = {

		// Account information
		id 			: 1,
		username	: 'tongueta',

		steps		: {
			1:false,
			2:false,
			3:false
		}

	};

	var accounts = [
		{
			user_id 			: 1,
			login 				: 'diegobattini',
			network 			: 'mixcloud',
			status 				: 'Allowed',
			created 			: '2013-10-03 21:21:40',
			external_user_id	: 'diegobattini',
			type				: '',
			profile_url			: 'http://www.mixcloud.com/diegobattini/',
			profile_image		: 'http://images-mix.netdna-ssl.com/w/100/h/100/q/85/upload/images/profile/c385f31c-c79a-4719-89f1-616b5fff6866.jpg',
			stats 				: {
				'cloudcasts':29,
				'listen':17,
				'followers':45,
				'favorites':5
			}
		},

		{
			user_id 			: 1,
			login 				: 'MrLugh',
			network 			: 'soundcloud',
			status 				: 'Allowed',
			created 			: '2013-10-03 21:23:03',
			external_user_id	: '410634',
			type				: '',
			profile_url			: 'http://soundcloud.com/mrlugh',
			profile_image		: 'https://i1.sndcdn.com/avatars-000000776464-p79ip6-large.jpg?3eddc42',
			stats 				: {
				'tracks':14,
				'playlists':1,
				'followers':11,
				'subscriptions':0
			}
		},

		{
			user_id 			: 1,
			login 				: 'mrlugh',
			network 			: 'tumblr',
			status 				: 'Allowed',
			created 			: '2013-10-03 21:40:11',
			external_user_id	: 'mrlugh',
			type				: '',
			profile_url			: 'http://mrlugh.tumblr.com/',
			profile_image		: 'http://api.tumblr.com/v2/blog/mrlugh.tumblr.com/avatar/512',
			stats 				: {
				'likes':7623,
				'blogs':1,
				'following':90,
				'followers':17,
				'posts':1387
			}
		},


		{
			user_id 			: 1,
			login 				: 'MrLugh',
			network 			: 'facebook',
			status 				: 'Allowed',
			created 			: '2013-10-10 04:33:08',
			external_user_id	: '228707297150088',
			type				: 'page',
			profile_url			: 'https://www.facebook.com/228707297150088',
			profile_image		: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash4/277120_228707297150088_4280565_n.jpg',
			stats 				: {
				'likes':6
			}
		},

		{
			user_id 			: 1,
			login 				: 'MrLugh',
			network 			: 'twitter',
			status 				: 'Allowed',
			created 			: '2013-10-03 21:22:10',
			external_user_id	: '69881737',
			type				: '',
			profile_url			: 'https://twitter.com/MrLugh',
			profile_image		: 'https://si0.twimg.com/profile_images/1530417102/circo_normal.jpeg',
			stats 				: {
				'statuses':612,
				'followers':43,
				'friends':103,
				'favourites':23
			}
		},

	];

	var login = function(data) {

		var deferred = $q.defer();

		var params = {
			'params':{
				'plugin':null,
				'controller':'users',
				'action':'login',
				'named':[],
				'pass':[],
				'isAjax':false				
			},
			'data':{'User':{'username':data.username,'password':data.password}},
			'query':[],
			'url':'users\/login',
			'base':'',
			'webroot':'\/',
			'here':'\/users\/login'
		};

		console.log(params);

	    $http({method: 'POST', url: '/users/login',data:params}).
	    success(function(data, status, headers, config) {
	    	console.log('success');
	    	//console.log(data);
	    	console.log(status);
	    	console.log(headers);
	    	console.log(config);
	    }).
	    error(function(data, status, headers, config) {
	    	console.log('error');
	    	//console.log(data);
	    	console.log(status);
	    	console.log(headers);
	    	console.log(config);
	    });

	    return deferred.promise;
	}

	var getAccounts = function() {

		return accounts;
	}

	return {

		isLogged: function() {
			return Boolean(user);
		},

		getUser: function() {
			return user;
		},

		deleteAccount: function(index) {
			var list = [];
			for (x in accounts) {
				if (x != index) {
					list.push(accounts[x]);
				}
			}
			accounts = list;
		},

		countByNetwork: function(network) {
			var count = 0;
			for (x in accounts) {
				if (accounts[x].network == network) {
					count++;
				}
			}
			return count;
		},

		login:login,
		getAccounts:getAccounts,

	}

}]);