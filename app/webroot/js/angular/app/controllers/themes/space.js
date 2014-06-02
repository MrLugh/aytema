function themeSpaceCo($scope,appSv,userSv,contentSv,$sce) {

	$scope.contentSv= contentSv;
	$scope.userSv	= userSv;
	$scope.user 	= userSv.getUser();

	$scope.accounts	= {};
	$scope.accountsLoaded = false;

	$scope.limit 	= 10;
	$scope.offset	= 0;
	$scope.list 	= [];
	$scope.filters	= {'concepts':[],'networks':[]};
	$scope.networks = [];
	$scope.concepts = [];
	$scope.current	= 0;
	$scope.content	= {};
	$scope.controlHover = false;
	$scope.mode 	= true;

	$scope.indexComments= 0;
	$scope.isComments	= false; 

	$scope.config		= {};
	$scope.configLoaded = false;
    $scope.showConfig = false;
	$scope.tabs = [
		{ title:"Colors", key:"colors", active: true },
		{ title:"background Image", key:"background" },
		{ title:"Fonts", key:"fonts" },
		{ title:"Width", key:"width" },
	];
	$scope.activeAdminTab = 'colors';

	$scope.showFooter = false;

	userSv.loadThemeConfig('space');
	userSv.loadAccounts();

	$scope.isLogged = function() {
		return userSv.isLogged();
	}	

	$scope.initFilters = function() {

		var filters	= {'concepts':[],'networks':[]};
		var networks= appSv.getNetworks();

		for (var x in $scope.accounts) {
			var account = $scope.accounts[x]['Socialnet'];
			if (filters['networks'].indexOf(account.network) == -1){
				filters['networks'].push(account.network);
			}

			var concepts = networks[account.network]['concepts'];

			for (var y in concepts){
				var concept = concepts[y];
				if (filters['concepts'].indexOf(concept) == -1){
					filters['concepts'].push(concept);
				}
			}
		}

		if (!angular.equals($scope.filters, filters)) {
			$scope.filters = filters;
		}

		$scope.networks = filters.networks;
		$scope.concepts = filters.concepts;
		
	}

	$scope.generateFilters = function() {

		var newConcepts = [];
		var networks= appSv.getNetworks();

		for (var x in $scope.networks) {
			var network = $scope.networks[x];
			var concepts = networks[network]['concepts'];
			for (var y in concepts){
				var concept = concepts[y];
				if (newConcepts.indexOf(concept) == -1){
					newConcepts.push(concept);
				}
			}
		}

		$scope.concepts = newConcepts;
	}

	$scope.moreContent = function() {
		if (!contentSv.isLoading()) {
			$scope.setList();
		}
	}	


	$scope.setList = function() {

		if (!contentSv.isLoading() && $scope.configLoaded) {

			if ($scope.offset == 0) {
				$scope.content = {};
				$scope.current = 0;
			}

			if ($scope.concepts.length == 0) {
				$scope.list = [];
				return;
			}

			var params			= [];
			params['concepts']	= JSON.parse(JSON.stringify($scope.concepts));
			params['offset']	= $scope.offset;
			params['limit']		= $scope.limit;
			params['accounts']	= [];

			params['username']	= $scope.user.username;
			if (angular.isDefined($scope.user['id'])) {
				params['user_id']	= $scope.user.id;
			}

			for (var x in $scope.accounts) {
				var account = $scope.accounts[x].Socialnet;
				if ($scope.networks.indexOf(account.network) != -1) {
					params['accounts'].push(account.id);
				}
			}

			contentSv.getContentsByFilters(params).then(
				function(data) {
					var contents = data.contents;
					if (data.contents.length) {
						for (var x in contents) {
							content = contents[x].Content;
							$scope.list.push(content);
						}
						$scope.offset += $scope.limit;
						if (angular.isDefined($scope.list[$scope.current])) {
							$scope.content = $scope.list[$scope.current];
							$scope.scrollCurrent();
						}
					}
				},
				function(reason) {
					//console.log('Failed: ', reason);
				},
				function(update) {
					//console.log('Got notification: ', update);
				}
			);
		}
	}


	$scope.$watch("userSv.getAccounts()",function(accounts){

		if (accounts.length > 0) {
			$scope.accounts = accounts;
			$scope.accountsLoaded = true;
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.initFilters();
			$scope.setList();
		}
	},true);

	$scope.$watch("userSv.getThemeConfig()",function(configNew,configOld){
		if (!angular.equals(configNew, configOld)) {
			$scope.config = configNew;
			$scope.configLoaded = true;
		}

		if ($scope.configLoaded && $scope.accountsLoaded) {
			$scope.initFilters();
		}
	});

	$scope.$watch("userSv.getThemeConfig().custom.colors",function(colors){
		if (angular.isDefined(colors)) {
			$scope.config.custom.colors = colors;
			$scope.setColor();
		}		
	},true);

	$scope.$watch("userSv.getThemeConfig().custom.fonts",function(fonts){
		if (angular.isDefined(fonts)) {
			$scope.config.custom.fonts = fonts;
			$scope.setFont();
		}		
	},true);	

	$scope.$watch("userSv.getThemeConfig().custom.width",function(width){
		if (angular.isDefined(width)) {
			$scope.config.custom.width = width;
			$scope.getAppStyle();
		}		
	},true);

	$scope.$watch("userSv.getThemeConfig().custom.background",function(background){
		if (angular.isDefined(background)) {
			$scope.config.custom.background = background;
			$scope.setBackground();
		}		
	},true);

	$scope.$watch("contentSv.getQueue()",function(queue){
		if (queue.length>0) {
			$scope.showFooter = true;
		}
	},true);

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
        $scope.getStyle();
    });

	$scope.$watchCollection("[showFooter]",function(values){
		$scope.getFooterStyle();
	});

	$scope.$watchCollection("[controlHover,current]",function(values){
		$scope.getContentStyle();
		$scope.hideOnHover();
	});

	$scope.scrollCurrent = function() {

		element = angular.element(document.querySelector("#content_"+$scope.current));

		if (angular.isDefined(element[0])) {
			angular.element(document).ready(function(){

				var bg 	= angular.element(document.querySelector("#content_"+$scope.current+" .overlay_photo"));

				if (angular.isDefined(bg[0])) {

					var src = $(bg).css('background-image');
					src = src.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
					var image = new Image();
					image.onload = function() {
						console.log("load");
						$('html, body').animate({
							scrollTop: element[0].offsetTop
						}, 500);
					}

					image.src = src;

				} else {
					$('html, body').animate({
						scrollTop: element[0].offsetTop
					}, 500);
				}

			});
		}

	}

	$scope.move = function(direction) {

		if (direction > 0) {
			$scope.current++;
		} else {
			$scope.current--;	
		}

		if ($scope.current == $scope.list.length) {
			$scope.current = 0;
		}
		if ($scope.current < 0) {		
			$scope.current = $scope.list.length - 1;
		}

		if (angular.isDefined($scope.list[$scope.current])) {
			$scope.content = $scope.list[$scope.current];
			$scope.scrollCurrent();
		}

		if ( $scope.list.length - 1 - $scope.current < 5 ) {
			$scope.moreContent();
		}
	}

	$scope.showComments = function(index) {
		$scope.isComments	= !$scope.isComments;
		$scope.indexComments= index;
	}

    $scope.getContentCommentsHash = function() {
    	var c = $scope.list[$scope.indexComments];
    	return "http://cloudcial.com/comments/"+c.network + '_' + c.external_user_id + '_' + c.concept + '_' + c.external_id;
    }	

	$scope.networkIcon = function(network) {
		return "http://cloudcial.com/img/socialnet/icons/ce_"+network+".png";
	}

	$scope.statIcon = function(stat_name) {
		return contentSv.getStatIcon(stat_name);
	}

	$scope.conceptIcon = function(concept) {
		return contentSv.getConceptIcon(concept);
	}

	$scope.filterNetworkStyle = function(network) {

		var style = {'opacity':1};

		if ($scope.networks.indexOf(network) == -1) {
			style['opacity'] = '0.3';
		}

		return style;
	}

	$scope.filterConceptStyle = function(concept) {

		var style = {'opacity':1};

		if ($scope.concepts.indexOf(concept) == -1) {
			style['opacity'] = '0.3';
		}

		return style;
	}

	$scope.filterNetwork = function(network) {

		var index = $scope.networks.indexOf(network);
		if (index != -1) {
			var networks = [];
			for (var x in $scope.networks) {
				var network = $scope.networks[x];
				if (x != index) {
					networks.push(network);
				}
			}
			$scope.networks = networks;
		} else {
			$scope.networks.push(network);
		}
		$scope.generateFilters();
		$scope.offset	= 0;
		$scope.list 	= [];
		$scope.setList();
	}

	$scope.filterConcept = function(concept) {

		var index = $scope.concepts.indexOf(concept);
		if (index != -1) {
			var concepts = [];
			for (var x in $scope.concepts) {
				var concept = $scope.concepts[x];
				if (x != index) {
					concepts.push(concept);
				}
			}
			$scope.concepts = concepts;
		} else {
			$scope.concepts.push(concept);
		}
		$scope.offset	= 0;
		$scope.list 	= [];
		$scope.setList();
	}

	$scope.getStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}


		appSv.setMyWH(appSv.getHeight() - $scope.menuHeight);
		return {
			'min-height':appSv.getHeight() - $scope.menuHeight + 'px',
			'opacity': ($scope.isComments) ? '0':'1',
			'margin-top': $scope.menuHeight + 'px',
			//'background-color': $scope.config.custom.colors.background.value
		};
	}

	$scope.getCommentsColor = function() {

		var color = $scope.config.custom.colors.background.value.replace("#","");

		if (contentSv.getContrast50(color) == 'white') {
			return "dark";
		}
		return "light";
	}

	$scope.getCommentsStyle = function() {
		var style = {
			'height':appSv.getHeight() - $scope.menuHeight + 'px',
			'top':$scope.menuHeight + 'px',
			'left':($scope.isComments) ? '0':'-100%',
			'background-color':$scope.config.custom.colors.background.value,
			'color':$scope.config.custom.colors.contentText.value
		}

		return style;
	}

	$scope.getQueueStyle = function() {
		return {'width':appSv.getWidth() + 'px'};
	}


	$scope.getAccountLink = function(index,external_user_id) {
		for (var x in $scope.accounts) {
			var account = $scope.accounts[x].Socialnet;
			if (account.external_user_id == external_user_id && 
				account.network == $scope.list[index].network ) {
				return account.profile_url;
			}
		}
		return '';
	}

	$scope.getProfileImg = function(index) {
		var external_user_id = $scope.list[index].external_user_id;
		for (var x in $scope.accounts) {
			var account = $scope.accounts[x].Socialnet;
			if (account.external_user_id == external_user_id && 
				account.network == $scope.list[index].network ) {
				return account.profile_image;
			}
		}
		return '';
	}

	$scope.hideOnHover = function() {

		if ($scope.controlHover) {
			return {'display':'none'}
		}
		return {'display':'block'}
	}

    $scope.adminTheme = function() {
    	$scope.showConfig = !$scope.showConfig;
    };

    $scope.footer = function() {
    	$scope.showFooter = !$scope.showFooter;
    };

    $scope.getAppStyle = function() {
    	var width = "100%";
    	if (!angular.equals({},$scope.config)) {
    		width = $scope.config.custom.width;
    	}

    	return {'width':width};
    }

    $scope.getAppClass = function() {

    	if (angular.equals({},$scope.config)) {
    		return '';
    	}

    	if ($scope.config.custom.width != "100%") {
    		return 'boxed';
    	}
    	return '';
    }

	$scope.setColor = function() {

		var element = angular.element(document.querySelector('#list'));
		//$(element[0]).css('background-color',$scope.config.custom.colors.background.value);

		var element = angular.element(document.querySelector('.link_comments'));
		$(element[0]).css('color',$scope.config.custom.colors.contentText.value);

	}

	$scope.setFont = function() {

		var element = angular.element(document.querySelector('body'));
		$(element[0]).css('font-family',$scope.config.custom.fonts.selected.family);
		$(element[0]).css('font-size',$scope.config.custom.fonts.selected.size);
	}

	$scope.getModeTitle = function() {
		return $scope.mode ? 'Text mode' : 'Full Height mode';
	}

	$scope.changeMode = function() {
		$scope.mode = !$scope.mode;
	}

	$scope.getModeIconClass = function() {
		return $scope.mode ? 'fa fa-text-height' : 'fa fa-picture-o';
	}

	$scope.getListClass = function() {
		return $scope.mode ? 'list_full' : 'list_text';
	}

	$scope.getControlsStyle = function() {
    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

    	return {
    		'top':$scope.menuHeight + 'px',
    		'background-color':$scope.config.custom.colors.contentBackground.value
    	}
	}

	$scope.getControlsButtonStyle = function() {
    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

		return {
			'color':$scope.config.custom.colors.contentText.value,
		};		
	}

    $scope.getConfigStyle = function() {
	   	if ($scope.showConfig == true) {
	   		return {'left':'0'};
    	}
	   	return {'left':'0'};
    };

    $scope.getConfigButtonStyle = function() {
	   	if ($scope.showConfig == true) {
	   		return {'left':'100%'};
    	}
	   	return {'left':'0'};
    };

    $scope.getFooterStyle = function() {

    	var style = {};

    	var width = "100%";
    	if (!angular.equals({},$scope.config)) {
    		width = $scope.config.custom.width;
    		style['background-color'] = $scope.config.custom.colors.contentBackground.value;
    	}

    	style['¨width'] = width;		

	   	if ($scope.showFooter == true) {
	   		style['bottom'] =  0;
	   		return style;
    	}
    	style['bottom'] = -$scope.footerHeight + 'px';

	   	return style;
    }

    $scope.getFooterButtonStyle = function() {

    	var style = {};

	   	if ($scope.showFooter == true) {
	   		style['bottom'] = '100%';
    	} else {
    		style['bottom'] = '0';
    	}

    	if (!angular.isDefined($scope.config.custom)) {
    		return style;
    	}

    	style['background-color'] = $scope.config.custom.colors.contentBackground.value;
	   	return style;
    };	    

    $scope.getMenuStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

		return {
			'background-color':$scope.config.custom.colors.contentBackground.value,
			'color':$scope.config.custom.colors.contentText.value,
		};
    }

    $scope.getProfileStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

    	return {
    		'border': '2px solid '+$scope.config.custom.colors.contentText.value
    	}
    }

    $scope.getContentBarStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

		var rgb = contentSv.hexToRgb($scope.config.custom.colors.background.value);
		var rgbString = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.9)";

    	return {
    		'background-color':rgbString,
			'color':$scope.config.custom.colors.contentText.value
		}

	}

    $scope.getContentStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

    	var style = {
			//'background-color':$scope.config.custom.colors.contentBackground.value,
			'color':$scope.config.custom.colors.contentText.value,    		
    	}

		if ($scope.config.custom.width != "100%") {
    		style['width']	= '90%';
		}

		style['height'] = appSv.getHeight() - $scope.menuHeight + 'px';
		
    	return style;

    }

    $scope.getFooterContrastStyle = function() {

    	if (!angular.isDefined($scope.config.custom)) {
    		return {};
    	}

		var color = $scope.config.custom.colors.contentBackground.value.replace("#","");
		return {'color':contentSv.getContrast50(color)}
    }

    $scope.getContentClass = function(index) {

    	if ($scope.current != index) {
    		return '';
    	}
    	var current = $scope.list[$scope.current];
    	return 'content_hover';
    }

	$scope.hasPlayer = function(index) {

		var content = contentSv.getQueue()[index];
		if (!angular.isDefined(content)) {
			return false;
		}
		return true;
	}

	$scope.getPlayer = function(index) {

		var content = contentSv.getQueue()[index];
		if (!angular.isDefined(content)) {
			return $sce.trustAsHtml("");
		}
		return $sce.trustAsHtml(contentSv.cleanSource(contentSv.getPlayer(content)));
	}

	$scope.setBackground = function() {

		var element = angular.element(document.querySelector('#list'));
		$(element[0]).css('background','url("'+$scope.config.custom.background.selected+'") repeat');

	}	
}