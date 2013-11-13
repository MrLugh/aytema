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

		console.log(vars.join("&"));

	    $http({method: 'GET', url: url,data:params}).
	    success(function(data, status, headers, config) {

	    	processContent(data.contents);

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

	var deleteContent = function(content) {

		//TODO: Delete on backend side, and run next code on then function

		var index = dicContent.indexOf(content);

		delete lists['concepts'][content.concept][lists['concepts'][content.concept].indexOf(index)];
		delete lists['networks'][content.network]['all'][lists['networks'][content.network]['all'].indexOf(index)];
		delete lists['networks'][content.network]['concepts'][content.concept][lists['networks'][content.network]['concepts'][content.concept].indexOf(index)];
		delete dicContent[index];

    	deferred.resolve();
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
		for (x in params) {
			vars.push(x+"="+params[x]);
		}

		var url = '/contents/index.json';
		if (vars.length) {
			url +="?"+vars.join("&");
		}

		console.log(url);

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
		cleanSource:cleanSource,
		loadContent:loadContent,
		getListsByConcept:getListsByConcept,
		getListsByNetwork:getListsByNetwork,
		getContentsByFilters:getContentsByFilters,
		getStatIcon:getStatIcon,
		getConceptIcon:getConceptIcon,
		deleteContent:deleteContent,
	};

}]);