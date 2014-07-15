ayTemaSs.factory('contentSv',['$q', '$http', 'userSv','appSv',function($q,$http,userSv,appSv){

	var user 		= userSv.getUser();
	var dicContent	= [];

	var queue 		= [];

	var pagesList = {};

	var offset		= 0;
	var limit		= 8;
	var loading		= false;

	var badImages	= [];
	var images 		= [];

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

		
		source = source.replace('autoplay=1','autoplay=0');
		source = source.replace('auto_play=true','auto_play=false');
		source = source.replace('autostart=true','autostart=false');

		return source;
	};

	var getStatIcon = function(stat_name) {

		var icon_class = "";

		if (stat_name == 'comments') {
		    icon_class= "fa fa-comments";
		} else if (stat_name == 'plays' ||
			stat_name == 'listen') {

		    icon_class= "fa fa-play";
		} else if (stat_name == 'downloads') {
		    icon_class= "fa fa-cloud-download";
		} else if (stat_name == 'favorites' ||
			stat_name == 'likes'			||
			stat_name == 'favourites') {

		    icon_class= "fa fa-thumbs-up";
		} else if (stat_name == 'dislikes') {
		    icon_class= "fa fa-thumbs-down";
		} else if (stat_name == 'activities') {
		    icon_class= "fa fa-bar-chart-o";
		} else if (stat_name == 'views') {
		    icon_class= "fa fa-eye";
		} else if (stat_name == 'followers' ||
			stat_name == 'subscribers'		||
			stat_name == 'subscriptions'	||
			stat_name == 'contacts') {

		    icon_class= "fa fa-users";
		} else if (stat_name == 'friends') {
		    icon_class= "fa fa-sitemap";
		} else if (stat_name == 'videos') {  
		    icon_class= "fa fa-video-camera";
		} else if (stat_name == 'tracks'	||
			stat_name == 'cloudcasts') {

		    icon_class= "fa fa-music";
		} else if (stat_name == 'photos') {
		    icon_class= "fa fa-camera";
		} else if (stat_name == 'posts' ||
			stat_name == 'statuses') {

		    icon_class= "fa fa-file-text";
		} else if (stat_name == 'quotes') {
		    icon_class= "fa fa-quote-left";
		} else if (stat_name == 'blogs' ||
			stat_name == 'playlists'	||
			stat_name == 'channels'		||
			stat_name == 'albums') {

		    icon_class= "fa fa-list";
		} else if (stat_name == 'following') {
		    icon_class= "fa fa-star";
		} else if (stat_name == 'events') {
		    icon_class= "fa fa-calendar";
		}

		return icon_class;
	};

	var getConceptIcon = function(concept) {

		var icon_class = "";

        if (concept == 'video' || concept == 'videos') {
        	icon_class= "fa fa-video-camera";
        } else if (concept == 'track' || concept == 'tracks') {
        	icon_class= "fa fa-music";
        } else if (concept == 'photo' || concept == 'photos') {
        	icon_class= "fa fa-camera";
        } else if (concept == 'post' || concept == 'posts') {
        	icon_class= "fa fa-file-text";
        } else if (concept == 'quote' || concept == 'quotes') {
        	icon_class= "fa fa-quote-left";
        } else if (concept == 'chat' || concept == 'chats') {
        	icon_class= "fa fa-book";
        } else if (concept == 'link' || concept == 'links') {
        	icon_class = "fa fa-link";
        } else if (concept == 'event' || concept == 'events') {
        	icon_class = "fa fa-calendar";
        }

		return icon_class;        
	}

	var getNetworkIcon = function(network) {

		var icon_class = "";

        if (network == "cloudcial") {
            icon_class = "fa fa-cloud";
        } else if (network == "facebook") {
            icon_class = "fa fa-facebook";
        } else if (network == "twitter") {
            icon_class = "fa fa-twitter";
        } else if (network == "youtube") {
            icon_class = "fa fa-youtube";            
        } else if (network == "vimeo") {
            icon_class = "fa fa-vimeo-square";
        } else if (network == "tumblr") {
            icon_class = "fa fa-tumblr";
        } else if (network == "mixcloud") {
            icon_class = "fa fa-renren";
        } else if (network == "soundcloud") {
            icon_class = "fa fa-soundcloud";
        }
		return icon_class;        
	}

	var deleteContent = function(id) {
		var deferred= $q.defer();

		var params = [];

		params['id'] = id;


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

		/*
		if (loading) {
			deferred.resolve({});
			return;
		}
		*/

		loading = true;

		if (!angular.isDefined(params)) {
			var params = [];
		}


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

		if (!angular.isDefined(content)) {
			return '';
		}		
	
		var href = "https://www.facebook.com/"+content['external_user_name']+"/posts/"+content['external_atomic_id'];

		return href;
	}

	var isBadImage = function(image) {
		return badImages.indexOf(image) != -1;
	}

	var getThumbnail = function(content) {

		var source = '';

		if (!angular.isDefined(content)) {
			return source;
		}

		if (content.concept == 'video') {

			if (content.network == 'vimeo') {
				if (!this.isBadImage(content.data.thumbnails.thumbnail[1]['_content'])) {
					source = content.data.thumbnails.thumbnail[1]['_content'];
				}
			}

			if (content.network == 'youtube') {
				if (!this.isBadImage(content.data.thumbnail)) {
					source = content.data.thumbnail;
				}
			}

			if (content.network == 'tumblr') {
				if (angular.isDefined(content.data['thumbnail_url'])) {
					if (!this.isBadImage(content.data['thumbnail_url'])) {
						source = content.data['thumbnail_url'];
					}
				}
			}

			if (content.network == 'facebook') {
				if (angular.isDefined(content.data['picture'])) {
					if (!this.isBadImage(content.data['picture'])) {
						source = content.data['picture'];
					}					
				}

				if (angular.isDefined(content.data['format']) && content.data['format'].length>0) {
					var format = content.data['format'][content.data['format'].length-1];
					if (!this.isBadImage(format.picture)) {
						source = format.picture;
					}
				}
			}

		}

		if (content.concept == 'track') {
			if (content.network == 'tumblr') {
				if (angular.isDefined(content.data['thumbnail_url'])) {
					if (!this.isBadImage(content.data['thumbnail_url'])) {
						source = content.data['thumbnail_url'];
					}
				}
				if (angular.isDefined(content.data['album_art'])) {
					if (!this.isBadImage(content.data['album_art'])) {
						source = content.data['album_art'];
					}
				}
			}

			if (content.network == 'soundcloud') {
				if (angular.isDefined(content.data['artwork_url']) &&
					typeof content.data['artwork_url'] == 'string'){
						if (!this.isBadImage(content.data['artwork_url'].replace("large","t500x500"))) {
							source = content.data['artwork_url'].replace("large","t500x500");
						}
				}
			}

			if (content.network == 'mixcloud') {
				if (angular.isDefined(content.data['pictures'])) {
					if (!this.isBadImage(content.data['pictures']['extra_large'])) {
						source = content.data['pictures']['extra_large'];
					}
				}
			}
		}

		if (content.concept == 'photo')	{

			if (content.network == 'tumblr') {
				if (!this.isBadImage(content.data.photos[0].original_size.url)) {
					source = content.data.photos[0].original_size.url;
				}
			}

			if (content.network == 'facebook') {
				//source = content.data.picture.replace(/_s./g,'_n.');
				if (!this.isBadImage(content.data.source)) {
					source = content.data.source;
				}
			}
		}

		if (content.concept == 'post')	{

			if (content.network == 'facebook') {
				if (angular.isDefined(content.data['picture'])) {

					if (!this.isBadImage(content.data['picture'])) {
						source = content.data['picture'];
					}
					
					if (source.search(/([a-z]?)[0-9]+x[0-9]+\//gmi) > -1) {

						if (!this.isBadImage(source.replace(/([a-z]?)[0-9]+x[0-9]+\//gmi,""))) {
							source = source.replace(/([a-z]?)[0-9]+x[0-9]+\//gmi,"");
						}

						if (!this.isBadImage(source.replace(/\/v\/+/gmi,"/"))) {
							source = source.replace(/\/v\/+/gmi,"/");
						}
					}

					if (source.search('safe_image.php') > -1) {

						var urls = source.split("&");
						for (var x in urls ) {
							if (urls[x].search("url=")>-1) {
								var url = decodeURIComponent(urls[x].split("url=").slice(-1)[0]);
								if (!this.isBadImage(url)) {
									source = url;
								}
							}
						}

					}

				}
			}
		}

		if (content.concept == 'event')	{

			if (content.network == 'cloudcial') {
				source ="https://maps.googleapis.com/maps/api/staticmap?"+
						"sensor=false"+
						"&size=850x850"+
						"&markers="+encodeURI(content.data.address)+
						"&client_id="+encodeURI("AIzaSyDgE0KcEAKdRQl9IReB4E7ZBZpQOL2Cxz8");
			}
		}

		return source;
	}

	var getPlayer = function(content) {

		var source = '';

		if (!angular.isDefined(content)) {
			return source;
		}		

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
				if (angular.isDefined(content.data['embed_html'])) {
					source = content.data['embed_html'];
				}
			}

			if (content.network == 'youtube') {
				var src = 'http://www.youtube.com/embed/'+content.external_id+'?wmode=transparent&autohide=1&egm=0&hd=1&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&showsearch=0';
				source = '<iframe src="'+src+'" frameborder="0" allowfullscreen></iframe>';
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
				//url = content.data['permalink_url'];
				url = "http://api.soundcloud.com/tracks/"+content.data['id'];
				source = '<iframe scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url='+url+'&visual=true&liking=false&sharing=false&auto_play=false&show_comments=false&continuous_play=false&origin=tumblr"></iframe>';
			}

			if (content.network == 'mixcloud') {
				if (angular.isDefined(content.data['embed'])) {
					source = content.data['embed'];
				}
			}
		}

		return source;
	}

	var getEmbed = function(content) {

		var embed = ''

		if (!angular.isDefined(content)) {
			return embed;
		}		

		if (content.network == 'twitter') {
			if (angular.isDefined(content.data['embed'])) {
				embed = content.data['embed'];
			}
		}

		return embed;
	}

	var getTitle = function(content) {

		var title = '';

		if (!angular.isDefined(content)) {
			return title;
		}		

		if (content.network == 'tumblr') {

			if (angular.isDefined(content.data['slug'])&& 
				angular.isString(content.data['slug']) &&
				content.data['slug'].length) {
				title = content.data['slug'];
			}

			if (angular.isDefined(content.data['source_title']) &&
				angular.isString(content.data['source_title']) &&
				content.data['source_title'].length) {
				title = content.data['source_title'];
			}

			if (angular.isDefined(content.data['title']) &&
				angular.isString(content.data['title']) &&
				content.data['title'].length) {
				title = content.data['title'];
			}			
		}

		if (content.network == 'vimeo') {
			title = content.data.title;
		}

		if (content.network == 'youtube') {
			title = content.data['title'];
		}

		if (content.network == 'soundcloud') {
			title = content.data.title;
		}

		if (content.network == 'mixcloud') {
			title = content.data.name;
		}

		if (content.network == 'facebook') {

			if (angular.isDefined(content.data['name'])) {
				title = content.data['name'];
			}

		}		

		return title.replace(/-/g, ' ');
	}

	var getDescription = function(content) {

		var description = '';

		if (!angular.isDefined(content)) {
			return description;
		}

		if (content.network == 'tumblr') {

			if (angular.isDefined(content.data['caption'])) {
				description = content.data['caption'];
			}

			if (angular.isDefined(content.data['body'])) {
				description = content.data['body'];
			}

		}

		if (content.network == 'facebook') {

			if (angular.isDefined(content.data['description'])) {
				description = content.data['description'];
			}

			if (angular.isDefined(content.data['caption'])) {
				description = content.data['caption'];
			}

			if (angular.isDefined(content.data['story'])) {
				description = content.data['story'];
			}

			if (angular.isDefined(content.data['message'])) {
				description = content.data['message'];
			}

		}

		if (content.network == 'vimeo') {
			description = content.data.description;
		}

		if (content.network == 'youtube') {
			description = content.data['content'];
		}

		return description;
	}

	var getDialogues = function(content) {

		var dialogues = '';

		if (!angular.isDefined(content)) {
			return dialogues;
		}		

		if (content.network == 'tumblr') {
			if (angular.isDefined(content.data['dialogue'])) {
				dialogues =  content.data['dialogue'];
			}
		}

		return dialogues;
	}

	var getQuoteText = function(content) {

		var text = '';

		if (!angular.isDefined(content)) {
			return text;
		}		

		if (content.network == 'tumblr') {
			if (angular.isDefined(content.data['text'])) {
				text = content.data['text'];
			}
		}

		return text;
	}

	var getQuoteSource = function(content) {

		var source = '';

		if (!angular.isDefined(content)) {
			return source;
		}		

		if (content.network == 'tumblr') {
			if (angular.isDefined(content.data['source'])) {
				source = content.data['source'];
			}
		}

		return source;
	}

	var getUrl = function(content) {

		var url = '';

		if (!angular.isDefined(content)) {
			return url;
		}		

		if (content.network == 'tumblr') {
			if (angular.isDefined(content.data['url'])) {
				url = content.data['url'];
			}
		}

		return url;
	}	

	var getTwitterShareOptions = function(content) {
		var options = [];
		options.push("status=1");
		return options;
	}

	var getFacebookShareOptions = function(content) {
		var options = [];

		if (!angular.isDefined(content)) {
			return options;
		}		

		if (content.network == 'tumblr' && content.concept == 'photo' && content.data.photos.length > 1) {
			for(x in content.data.photos) {
				var element = content.data.photos[x];
				options.push("p[images]["+x+"]="+element.original_size.url);
			}

		} else {
			var thumbnail = this.getThumbnail(content);
			if (thumbnail.length > 0){
				options.push("p[images][0]="+thumbnail);
			}
		}

		var title = $("<p>").html(this.getTitle(content)).text();
		if (title.length > 0){
			options.push("p[title]="+title);
		}
		var summary = $("<p>").html(this.getDescription(content)).text();
		if (summary.length > 0){
			options.push("p[summary]="+summary);
		}
		
		return options;
	}

	var getTumblrShareOptions = function(content) {
		var options = [];

		if (!angular.isDefined(content)) {
			return options;
		}		

		var thumbnail = this.getThumbnail(content);
		if ( content.concept == 'photo' && thumbnail.length > 0){
			options.push("source="+encodeURIComponent(thumbnail));
		}
		var player = this.getPlayer(content);
		if ( content.concept == 'video' && player.length > 0){
			options.push("embed="+encodeURIComponent(player));
		}
		var title = $("<p>").html(this.getTitle(content)).text();
		if (title.length > 0){
			options.push("title="+title);
			options.push("name="+title);
		}
		var description = $("<p>").html(this.getDescription(content)).text();
		if (description.length > 0){
			options.push("description="+description);
			options.push("caption="+description);
		}		
		
		return options;
	}


	var getTrackUrl = function(content) {

		var source = '';

		if (!angular.isDefined(content)) {
			return source;
		}

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

	var addToQueue = function(content) {

		for (var x in queue) {
			var item = queue[x];
			if (item.id == content.id) {
				return false;
			}
		}
		queue.push(content);

	}

	var deleteFromQueue = function(content) {
		delete queue[queue.indexOf(content)];
	}

	var createContent = function(content) {
		var deferred = $q.defer();

		var url = '/contents/add.json';

	    $http({method: 'POST', url: url,data:{content:content}}).
	    success(function(data, status, headers, config) {
	    	deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
	    	console.log('error');
	    	user = {};
	    	deferred.resolve(data);
	    });

	    return deferred.promise;		
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

		isBadImage:isBadImage,
		
		getContentsByFilters:getContentsByFilters,
		
		getStatIcon:getStatIcon,
		getConceptIcon:getConceptIcon,
		getNetworkIcon:getNetworkIcon,
		
		deleteContent:deleteContent,
		activateContent:activateContent,

		getFacebookContentHrefEmbed:getFacebookContentHrefEmbed,

		getThumbnail:getThumbnail,
		getPlayer:getPlayer,
		getEmbed:getEmbed,
		getTitle:getTitle,
		getDescription:getDescription,
		getUrl:getUrl,
		getDialogues:getDialogues,
		getQuoteText:getQuoteText,
		getQuoteSource:getQuoteSource,
		getTrackUrl:getTrackUrl,

		getRelatedContent:getRelatedContent,

		getTwitterShareOptions:getTwitterShareOptions,
		getFacebookShareOptions:getFacebookShareOptions,
		getTumblrShareOptions:getTumblrShareOptions,

		createContent:createContent,

		addToQueue:addToQueue,
		getQueue: function() {
			return queue;
		},
		deleteFromQueue:deleteFromQueue,

		getContrast50: function(hexcolor) {
			return (parseInt(hexcolor, 16) > 0xffffff/2) ? 'black':'white';
		},
		cutHex:function(h) {
			return (h.charAt(0)=="#") ? h.substring(1,7):h
		},		
		hexToRgb: function(h){
			var r = parseInt((this.cutHex(h)).substring(0,2),16);
			var g = parseInt((this.cutHex(h)).substring(2,4),16);
			var b = parseInt((this.cutHex(h)).substring(4,6),16);

			var rgb = {r:r,g:g,b:b};
			return rgb;
		},

		setPageList: function(page,list) {
			if (!angular.isDefined(pagesList[page])) {
				pagesList[page] = {};
			}
			pagesList[page] = list;
		},
		getPagesList: function() {
			return pagesList;
		},
		getPageList: function(page) {
			return pagesList[page];
		},
		getImages: function() {
			return mages;
		},		
		getBadImages: function() {
			return badImages;
		},
		addBadImages: function(src){
			console.log("add badgimage");
			console.log(src);
			if (badImages.indexOf(src) == -1) {
				badImages.push(src);
			}
		},
		addImages: function(src){
			if (images.indexOf(src) == -1) {
				images.push(src);
			}
		},
	};

}]);