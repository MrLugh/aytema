ayTemaSs.factory('userSv',['$q', '$http',function($q,$http){

	var user 		= {};
	var accounts 	= [];
	var themeConfig = {};
	var loading		= false;

	var setUser = function(data) {
		if (!angular.isDefined(user['steps'])) {
			data['steps'] = {1:false,2:false,3:false,4:false};
		}
		user =  data;		
	}

	var login = function(params) {
		var deferred = $q.defer();

		var url = '/users/login.json';

	    $http({method: 'POST', url: url,data:params}).
	    success(function(data, status, headers, config) {
	    	setUser(data.user);
	    	deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
	    	console.log('error');
	    	user = {};
	    	deferred.resolve(data);
	    });

	    return deferred.promise;
	}

	var addFollow = function(url,params) {

		var deferred = $q.defer();

	    $http({method: 'GET', url: url,data:params}).
	    success(function(data, status, headers, config) {
	    	console.log('success');
	    	console.log(data);
	    	deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
	    	console.log('error');
	    	console.log(data);
	    	deferred.resolve();	    	
	    });

	    return deferred.promise;
	}

	var loadAccounts = function(params) {

		var deferred = $q.defer();

		var url = '/socialnets/index.json';

	    $http({
	    	method: 'POST',
	    	url: url,
	    	data:params
	   	})
	   	.success(function(data, status, headers, config) {
	    	accounts= data.socialnets;
	    	deferred.resolve(data);
	    })
	    .error(function(data, status, headers, config) {
	    	console.log('error');
	    	deferred.resolve();	    	
	    });

	    return deferred.promise;
	}

	var loadUsersForAccount = function(params) {

		var deferred = $q.defer();

		var url = '/users/usersInSocialnet.json';

	    $http({
	    	method: 'POST',
	    	url: url,
	    	data:params
	   	})
	   	.success(function(data, status, headers, config) {
	    	deferred.resolve(data);
	    })
	    .error(function(data, status, headers, config) {
	    	console.log('error');
	    	deferred.resolve();	    	
	    });

	    return deferred.promise;
	}	

	var search = function(params) {

		var deferred = $q.defer();
		
		var url = '/users/index.json';

	    $http({
	    	method: 'POST',
	    	url: url,
	    	data:params
	    })
	    .success(function(data, status, headers, config) {
	    	deferred.resolve(data);
	    })
	    .error(function(data, status, headers, config) {
	    	console.log('error');
	    	deferred.resolve();
	    });

	    return deferred.promise;
	}	

	var deleteAccount = function(account) {

		if (user.id != account.user_id) {
			return false;
		}

		var deferred = $q.defer();

	    $http({method: 'DELETE', url: '/socialnets/delete/'+account.id+'.json',data:{}}).
	    success(function(data, status, headers, config) {

	    	if (data.message == "ok") {
	    		for (x in accounts) {
	    			if (accounts[x].Socialnet.id == account.id) {
	    				delete accounts[x];
	    				break;
	    			}
	    		}
	    	}

	    	deferred.resolve();
	    }).
	    error(function(data, status, headers, config) {
	    	console.log('error');
	    	deferred.resolve();
	    });

	    return deferred.promise;
	}	

	var getAccounts = function() {

		return accounts;
	}

	var loadThemeConfig = function(theme) {

		var deferred = $q.defer();

	    $http({method: 'GET', url: '/themes/view/'+theme+'/'+user.username+'.json'}).
	    success(function(data, status, headers, config) {

	    	themeConfig = {'default':data.config,'custom':JSON.parse(JSON.stringify(data.config))};
	    	deferred.resolve();
	    }).
	    error(function(data, status, headers, config) {
	    	console.log('error');
	    	deferred.resolve();
	    });

	    return deferred.promise;

	}


	var saveThemeConfig = function() {

		var deferred = $q.defer();

		var params = {'type':themeConfig.custom.type,'config':themeConfig.custom};

	    $http({method: 'PUT', url: '/themes/setConfig.json',data:params}).
	    success(function(data, status, headers, config) {
	    	themeConfig = {'default':data.config,'custom':JSON.parse(JSON.stringify(data.config))};
	    	deferred.resolve();
	    }).
	    error(function(data, status, headers, config) {
	    	deferred.resolve();
	    });

	    return deferred.promise;

	}

	var saveProfileimage = function(path) {
		var deferred = $q.defer();

		var url = '/users/setProfileImage.json';

		var params = {'path':path}

	    $http({method: 'POST', url: url,data:params}).
	    success(function(data, status, headers, config) {
	    	user.profile_image = path;
	    	deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
	    	deferred.resolve(data);
	    });

	    return deferred.promise;
	}

	var restoreConfig = function() {
		themeConfig.custom = JSON.parse(JSON.stringify(themeConfig.default));
	}

	var getThemeConfig = function() {
		return themeConfig;
	}

	var setThemeConfigFilters = function(page,config) {
		themeConfig.custom.filters[page] = config;
	}

	var setThemeConfigContentsizes = function(config) {
		themeConfig.custom.contentsizes = config;
	}

	var setThemeConfigColors = function(config) {
		themeConfig.custom.colors = config;
	}


	var setThemeConfigFonts = function(fonts) {
		themeConfig.custom.fonts = fonts;
	}

	var setThemeConfigWidth = function(width) {
		themeConfig.custom.width = width;
	}	

	return {

		isLogged: function() {
			if (angular.equals(user, {})) {
				return false;
			}
			return angular.isDefined(user['id']);
		},

		getUser: function() {
			return user;
		},

		countByNetwork: function(network) {
			var count = 0;
			for (x in accounts) {
				if (accounts[x].Socialnet.network == network) {
					count++;
				}
			}
			return count;
		},

		getAccountById: function(id) {
			for (var x in accounts) {
				if (accounts[x].id == id) {
					return accounts[x]['Socialnet'];
				}
			}
			return false;
		},

	
		isLoading: function() {
			return loading;
		},		

		loadThemeConfig:loadThemeConfig,
		saveThemeConfig:saveThemeConfig,
		restoreConfig:restoreConfig,
		login:login,
		setUser:setUser,
		saveProfileimage:saveProfileimage,
		search:search,
		addFollow:addFollow,
		loadAccounts:loadAccounts,
		loadUsersForAccount:loadUsersForAccount,
		getAccounts:getAccounts,
		deleteAccount:deleteAccount,
		getNetworkProfileImage:function(network,external_user_id) {
			for (var x in accounts) {
				var account = accounts[x]['Socialnet'];
				if (account.network == network &&
					account.external_user_id == external_user_id) {
					return account.profile_image;
				}
			}
			return '';
		},
		getThemeConfig:getThemeConfig,
		setThemeConfigFilters:setThemeConfigFilters,
		setThemeConfigContentsizes:setThemeConfigContentsizes,
		setThemeConfigColors:setThemeConfigColors,
		setThemeConfigFonts:setThemeConfigFonts,
		setThemeConfigWidth:setThemeConfigWidth
	}

}]);