ayTemaSs.factory('userSv',['$q', '$http',function($q,$http){

	var user 		= false;
	var accounts 	= [];
	var themeConfig = {};
	var loading		= false;

	var login = function() {
		
	}

	var loadAccounts = function() {

		var deferred = $q.defer();

		var params = {user_id:user.id,status:'Allowed'};

		var vars = [];
		for (x in params) {
			vars.push(x+"="+params[x]);
		}

		var url = '/socialnets/index.json';
		if (vars.length) {
			url +="?"+vars.join("&");
		}

	    $http({method: 'GET', url: url,data:params}).
	    success(function(data, status, headers, config) {
	    	accounts= data.socialnets;
	    }).
	    error(function(data, status, headers, config) {
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

		if (themeConfig && themeConfig.theme == theme) {
			return themeConfig;
		}

		var deferred = $q.defer();

		var params = {'type':theme};

	    $http({method: 'GET', url: '/themes/getConfig.json',data:params}).
	    success(function(data, status, headers, config) {

	    	//themeConfig = {'default':JSON.parse(JSON.stringify(data.config)),'custom':data.config};
	    	themeConfig = {'default':data.config,'custom':data.config};
	    	deferred.resolve();
	    }).
	    error(function(data, status, headers, config) {
	    	console.log('error');

	    	deferred.resolve();
	    });

	    return deferred.promise;

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

	return {

		isLogged: function() {
			return Boolean(user);
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

		setUser: function(data) { // From user directive
			user =  data;
			user['steps'] = {1:false,2:false,3:false};
			user['theme'] = 'digest';
		},
		
		isLoading: function() {
			return loading;
		},		

		loadThemeConfig:loadThemeConfig,
		login:login,
		loadAccounts:loadAccounts,
		getAccounts:getAccounts,
		deleteAccount:deleteAccount,
		getThemeConfig:getThemeConfig,
		setThemeConfigFilters:setThemeConfigFilters,
		setThemeConfigContentsizes:setThemeConfigContentsizes,
		setThemeConfigColors:setThemeConfigColors
	}

}]);