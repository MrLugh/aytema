ayTemaSs.factory('contentSv',['$q', '$http', 'userSv','appSv',function($q,$http,userSv,appSv){

	var user 		= userSv.getUser();
	var dicContent	= [];

	/* content networks and concept lists
	lists = {
		networks : {
			facebook: {
				all	: [],
				concepts	: {
					photo	: [],
					video	: [],
					track	: [],
					post	: [],
				}
			},
			...
		},
		concepts	: {photo:[],video:[],track:[],post:[],...}
	};
	*/

	var lists 		= false;

	var offset		= 0;
	var limit		= 8;
	var loading		= false;


	var generateLists = function() {

		lists = {'networks':{},'concepts':{}};

		var networksData = appSv.getNetworks();
		for (var x in networksData) {
			var networkData = networksData[x];
			if (!angular.isDefined(lists['networks'][networkData.network])) {
				lists['networks'][networkData.network] = {all:[],concepts:{}};
			}

			for (var y in networkData.concepts) {

				var concept = networkData.concepts[y];

				if (!angular.isDefined(lists['networks'][networkData.network]['concepts'][concept])) {
					lists['networks'][networkData.network]['concepts'][concept] = [];
				}

				if (!angular.isDefined(lists['concepts'][concept])) {
					lists['concepts'][concept] = [];
				}

			}

		}
	}
	
	var addToLists = function(indexOfDic,content) {

		if (!lists) {
			generateLists();
		}

		var index = lists['networks'][content.network]['all'].indexOf(indexOfDic);
		if (index === -1) {
			lists['networks'][content.network]['all'].push(indexOfDic);
		}

		index = lists['networks'][content.network]['concepts'][content.concept].indexOf(indexOfDic);
		if (index === -1) {
			lists['networks'][content.network]['concepts'][content.concept].push(indexOfDic);
		}

		index = lists['concepts'][content.concept].indexOf(indexOfDic);
		if (index === -1) {
			lists['concepts'][content.concept].push(indexOfDic);
		}

	}

	var processContent = function(contents) {
		//dicContent = contents;

		for (var x in contents) {
			var content = contents[x].Content;

			// dicContent
			var index 	= dicContent.indexOf(content);
			if (index === -1) {
				//Adding content
				dicContent.push(content);
				index = dicContent.length -1;
			} else {
				//Updating content
				for (var key in content) {
					(!angular.isDefined(dicContent[index][key])) ? dicContent[index][key] = "" : null;
					dicContent[index][key] = content[key];
				}
			}

			addToLists(index,content);
		}

	}

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

		// TODO: Needs changed by data json
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

	    	processContent(data.contents);

	    	offset		+= limit;
	    	loading 	= false;
	    	deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
	    	loading 	= false;
	    	deferred.resolve(data);	    	
	    });

	    return deferred.promise;		
	};

	var cleanSource = function(source) {

		/*
		source = source.replace(/style="(.*?)"/g,'');
		source = source.replace(/style='(.*?)'/g,'');

		source = source.replace(/maxwidth="(.*?)"/g,'');
		source = source.replace(/maxwidth='(.*?)'/g,'');
		source = source.replace(/max-width="(.*?)"/g,'');
		source = source.replace(/max-width='(.*?)'/g,'');
		source = source.replace(/width="(.*?)"/g,'');
		source = source.replace(/width='(.*?)'/g,'');
		source = source.replace(/maxheight="(.*?)"/g,'');
		source = source.replace(/maxheight='(.*?)'/g,'');
		source = source.replace(/max-height="(.*?)"/g,'');
		source = source.replace(/max-height='(.*?)'/g,'');
		source = source.replace(/height="(.*?)"/g,'');
		source = source.replace(/height='(.*?)'/g,'');
		*/
		
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

	var getConceptIcon = function(concept) {

		var icon_class = "";

        if (concept == 'video') {
        	icon_class= "icon-facetime-video";
        } else if (concept == 'track') {
        	icon_class= "icon-music";
        } else if (concept == 'photo') {
        	icon_class= "icon-camera";
        } else if (concept == 'post') {
        	icon_class= "icon-font";
        } else if (concept == 'quote') {
        	icon_class= "icon-quote-left";
        } else if (concept == 'chat') {
        	icon_class= "icon-book";
        } else if (concept == 'link') {
        	icon_class = "icon-external-link";
        }

		return icon_class;        
	}

	var getListsByNetwork = function(network) {
		if (!lists || !angular.isDefined(lists['networks']) || !angular.isDefined(lists['networks'][network])) {
			return [];
		}
		return lists['networks'][network];
	}

	var getListsByConcept = function(concept) {
		if (!lists || !angular.isDefined(lists['concepts']) || !angular.isDefined(lists['concepts'][concept])) {
			return [];
		}
		return lists['concepts'][concept];
	}	

	var deleteContent = function(id) {
		var deferred= $q.defer();

		var params = [];

		params['id'] = id;

		// TODO: Needs changed by data json
		var vars = [];
		for (x in params) {
			vars.push(x+"="+params[x]);
		}

		var url = '/contents/delete.json';
		if (vars.length) {
			url +="?"+vars.join("&");
		}

	    $http({method: 'GET', url: url,data:params}).
	    success(function(data, status, headers, config) {
	    	deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
	    	deferred.resolve(data);   	
	    });

	    return deferred.promise;		
	}

	var activateContent = function(id) {
		var deferred= $q.defer();

		var params = [];

		params['id'] = id;

		// TODO: Needs changed by data json
		var vars = [];
		for (x in params) {
			vars.push(x+"="+params[x]);
		}

		var url = '/contents/activate.json';
		if (vars.length) {
			url +="?"+vars.join("&");
		}

	    $http({method: 'GET', url: url,data:params}).
	    success(function(data, status, headers, config) {
	    	deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
	    	deferred.resolve(data);   	
	    });

	    return deferred.promise;		
	}	

	var getContentsByFilters = function(params) {

		var deferred= $q.defer();

		if (loading) {
			deferred.resolve({});
			return;
		}

		loading = true;

		if (!angular.isDefined(params)) {
			var params = [];
		}

		params['user_id']	= user.id;

		// TODO: Needs changed by data json
		var vars = [];
		for (var x in params) {

			var param = params[x];

			if (!angular.isArray(param)) {
				vars.push(x+"="+params[x]);	
			} else {
				for (var y in param) {
					vars.push(x+"[]="+param[y]);
				}
			}
			
		}

		var url = '/contents/index.json';
		if (vars.length) {
			url +="?"+vars.join("&");
		}

	    $http({method: 'GET', url: url,data:params}).
	    success(function(data, status, headers, config) {
	    	loading 	= false;
	    	deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
	    	loading 	= false;
	    	deferred.resolve(data);
	    });

	    return deferred.promise;
	};

	var getRelatedContent = function(params) {

		var deferred= $q.defer();

		if (loading) {
			deferred.resolve({});
			return;
		}

		loading = true;

		if (!angular.isDefined(params)) {
			var params = [];
		}

		params['user_id']	= user.id;

		// TODO: Needs changed by data json
		var vars = [];
		for (var x in params) {

			var param = params[x];

			if (!angular.isArray(param)) {
				vars.push(x+"="+params[x]);	
			} else {
				for (var y in param) {
					vars.push(x+"[]="+param[y]);
				}
			}
			
		}

		var url = '/contents/relateds.json';
		if (vars.length) {
			url +="?"+vars.join("&");
		}

	    $http({method: 'GET', url: url,data:params}).
	    success(function(data, status, headers, config) {
	    	loading 	= false;
	    	deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
	    	loading 	= false;
	    	deferred.resolve(data);
	    });

	    return deferred.promise;
	};	

	var getFacebookContentHrefEmbed = function(content) {
	
		var href = "https://www.facebook.com/"+content['external_user_name']+"/posts/"+content['external_atomic_id'];

		/*
		if (angular.isDefined(content['data']['story'])) {
			if (angular.isDefined(content['data']['link'])) {
				href = content['data']['link'];				
			}
		}
		*/

		return href;
	}

	var getThumbnail = function(content) {

		var source = '';

		if (content.concept == 'video') {

			if (content.network == 'vimeo') {
				source = content.data.thumbnails.thumbnail[1]['_content'];
			}

			if (content.network == 'youtube') {
				source = content.data.thumbnail;
			}

			if (content.network == 'tumblr') {
				if (angular.isDefined(content.data['thumbnail_url'])) {
					source = content.data['thumbnail_url'];
				}
			}

			if (content.network == 'facebook') {
				if (angular.isDefined(content.data['picture'])) {
					source = content.data['picture'];
				}
			}

		}

		if (content.concept == 'track') {
			if (content.network == 'tumblr') {
				if (angular.isDefined(content.data['thumbnail_url'])) {
					source = content.data['thumbnail_url'];
				}
				if (angular.isDefined(content.data['album_art'])) {
					source = content.data['album_art'];
				}
			}

			if (content.network == 'soundcloud') {
				if (angular.isDefined(content.data['artwork_url']) &&
					typeof content.data['artwork_url'] == 'string') {
					source = content.data['artwork_url'];
				}
			}

			if (content.network == 'mixcloud') {
				if (angular.isDefined(content.data['pictures'])) {
					source = content.data['pictures']['extra_large'];
					;
				}
			}
		}

		if (content.concept == 'photo')	{

			if (content.network == 'tumblr') {
				source = content.data.photos[0].original_size.url;
			}

			if (content.network == 'facebook') {
				source = content.data.picture.replace(/_s./g,'_n.');
			}
		}

		if (content.concept == 'post')	{

			if (content.network == 'facebook') {
				if (angular.isDefined(content.data['picture'])) {
					source = content.data['picture'];
				}
			}
		}		

		return source;
	}

	var getPlayer = function(content) {

		var source = '';

		if (content.concept == 'video') {

			if (content.network == 'tumblr') {
				if (angular.isDefined(content.data['player'])) {
					if (angular.isArray(content.data['player'])) {
						source = content.data['player'][0]['embed_code'];
					}
				}
			}

			if (content.network == 'vimeo') {
				var id = content.external_id;
				source = '<iframe src="http://player.vimeo.com/video/'+id+'" width="250" height="188" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
			}

			if (content.network == 'facebook') {
				if (angular.isDefined(content.data['source'])) {
					source = content.data['source'];
					source =  '<iframe src="'+source+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
				}
			}

			if (content.network == 'youtube') {
				source = '<iframe src="//www.youtube.com/embed/'+content.external_id+'" frameborder="0" allowfullscreen></iframe>';
			}

		}

		if (content.concept == 'track') {
			if (content.network == 'tumblr') {
				if (angular.isDefined(content.data['embed'])) {
					source = content.data['embed'];
				}
				if (angular.isDefined(content.data['player'])) {
					source = content.data['player'];
				}
			}

			if (content.network == 'soundcloud') {
				url = content.data['permalink_url'];
				source = '<iframe scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url='+url+'&show_artwork=true&auto_play=true&buying=false&download=true&legacy_fallback=false&liking=false&sharing=true&show_comments=true&show_playcount=true"></iframe>';
			}

			if (content.network == 'mixcloud') {
				if (angular.isDefined(content.data['embed'])) {
					source = content.data['embed'];
				}
			}
		}

		return source;
	}

	var getTwitterShareOptions = function(content) {
		var options = [];
		options.push("status=1");
		return options;
	}

	var getFacebookShareOptions = function(content) {
		var options = [];
		var thumbnail = this.getThumbnail(content);
		if (thumbnail.length > 0){
			options.push("p[images][0]="+thumbnail);
		}
		
		return options;
	}

	var getTumblrShareOptions = function(content) {
		var options = [];

		var thumbnail = this.getThumbnail(content);
		if ( content.concept == 'photo' && thumbnail.length > 0){
			options.push("source="+encodeURIComponent(thumbnail));
		}
		var player = this.getPlayer(content);
		if ( content.concept == 'video' && player.length > 0){
			options.push("embed="+encodeURIComponent(player));
		}
		
		return options;
	}


	var getTrackUrl = function(content) {

		var source = '';


		if (content.network == 'tumblr') {
			if (angular.isDefined(content.data['source_url'])) {
				source = content.data['source_url'];
			}
		}

		if (content.network == 'soundcloud') {
			source = content.data['permalink_url'];
		}

		if (content.network == 'mixcloud') {
			source = content.data['url'];
		}

		return source;

	}

	return {
		getDicContent: function() {
			return dicContent;
		},
		getDicContentByKey: function(key) {
			if (!angular.isDefined(dicContent[key])) {
				return [];
			}
			return dicContent[key];
		},
		isLoading: function() {
			return loading;
		},
		isContentEnabled: function(content) {
			return content.status == "enabled";
		},		
		cleanSource:cleanSource,
		loadContent:loadContent,
		getListsByConcept:getListsByConcept,
		getListsByNetwork:getListsByNetwork,
		
		getContentsByFilters:getContentsByFilters,
		
		getStatIcon:getStatIcon,
		getConceptIcon:getConceptIcon,
		
		deleteContent:deleteContent,
		activateContent:activateContent,

		getFacebookContentHrefEmbed:getFacebookContentHrefEmbed,

		getThumbnail:getThumbnail,
		getPlayer:getPlayer,
		getRelatedContent:getRelatedContent,

		getTwitterShareOptions:getTwitterShareOptions,
		getFacebookShareOptions:getFacebookShareOptions,
		getTumblrShareOptions:getTumblrShareOptions,

		getTrackUrl:getTrackUrl

	};

}]);