ayTemaSs.factory('contentSv',['$q', '$http', 'userSv',function($q,$http,userSv){

	var user 		= userSv.getUser();
	var dicContent	= [];
	var offset		= 0;
	var limit		= 8;
	var filters		= [];
	var loading		= false;

	var loadContent = function(params) {

		if (loading) {
			return;
		}

		loading = true;

		if (!angular.isDefined(params)) {
			var params = [];
		}

		var deferred= $q.defer();

		params['user_id']	= user.id;
		params['offset']	= offset;
		params['limit']		= limit;

		var vars = [];
		for (x in params) {
			vars.push(x+"="+params[x]);
		}

		var url = '/contents/index.json';
		if (vars.length) {
			url +="?"+vars.join("&");
		}

	    $http({method: 'GET', url: url,data:params}).
	    success(function(data, status, headers, config) {
	    	dicContent 	= data.contents;
	    	offset		+= limit;
	    	loading 	= false;
	    	deferred.resolve();
	    }).
	    error(function(data, status, headers, config) {
	    	loading 	= false;
	    	deferred.resolve();	    	
	    });

	    return deferred.promise;		
	};

	var cleanSource = function(source) {

		source = source.replace(/maxwidth="*"/g,'');
		source = source.replace(/maxwidth='*'/g,'');
		source = source.replace(/max-width="*"/g,'');
		source = source.replace(/max-width='*'/g,'');
		source = source.replace(/width="*"/g,'');
		source = source.replace(/width='*'/g,'');
		source = source.replace(/maxheight="*"/g,'');
		source = source.replace(/maxheight='*'/g,'');
		source = source.replace(/max-height="*"/g,'');
		source = source.replace(/max-height='*'/g,'');
		source = source.replace(/height="*"/g,'');
		source = source.replace(/height='*'/g,'');
		source = source.replace('autoplay=1','autoplay=0');
		source = source.replace('auto_play=true','auto_play=false');
		source = source.replace('autostart=true','autostart=false');

		return source;
	};

	var getStatIcon = function(stat_name) {

		var icon_class = "";

		if (stat_name == 'comments') {
		    icon_class= "icon-comments";
		} else if (stat_name == 'plays' || stat_name == 'listen') {
		    icon_class= "icon-play-sign";
		} else if (stat_name == 'downloads') {
		    icon_class= "icon-cloud-download";
		} else if (stat_name == 'favorites' || stat_name == 'likes' || stat_name == 'favourites') {
		    icon_class= "icon-thumbs-up";
		} else if (stat_name == 'dislikes') {
		    icon_class= "icon-thumbs-down";
		} else if (stat_name == 'activities') {
		    icon_class= "icon-bar-chart";
		} else if (stat_name == 'views') {
		    icon_class= "icon-eye-open";
		} else if (stat_name == 'followers' || stat_name == 'subscribers' || stat_name == 'subscriptions') {
		    icon_class= "icon-user";
		} else if (stat_name == 'friends') {
		    icon_class= "icon-sitemap";
		} else if (stat_name == 'videos') {  
		    icon_class= "icon-facetime-video";
		} else if (stat_name == 'tracks' || stat_name == 'cloudcasts') {
		    icon_class= "icon-music";
		} else if (stat_name == 'photos') {
		    icon_class= "icon-camera";
		} else if (stat_name == 'posts' || stat_name == 'statuses') {
		    icon_class= "icon-file-text";
		} else if (stat_name == 'quotes') {
		    icon_class= "icon-quote-left";
		} else if (stat_name == 'blogs' || stat_name == 'playlists') {
		    icon_class= "icon-list";
		} else if (stat_name == 'following') {
		    icon_class= "icon-star";
		}

		return icon_class;		
	};

	return {
		getDicContent: function() {
			return dicContent;
		},
		cleanSource:cleanSource,
		loadContent:loadContent,
		getStatIcon:getStatIcon,

	};

}]);