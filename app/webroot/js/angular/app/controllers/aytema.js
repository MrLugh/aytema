function aytemaCo($scope,$location,userSv,appSv,contentSv) {

	$scope.userSearch= '';
	$scope.usersList = [];
	$scope.showMenu  = false;
	$scope.currentPage = false;

	$scope.steps = {
		accounts:false,
		themes:false
	};

	$scope.tour = false;

	$scope.searchUsers = function() {
		userSv.search({search:$scope.userSearch}).then(function(data){
			$scope.usersList = [];
			for (var x in data.users) {
				var user = data.users[x];
				$scope.usersList.push(user['User']);
			}
		});
	}

	$scope.showPage = function(page) {
		if ($scope.currentPage != page) {
			$scope.currentPage = page;
			$('html, body').animate({scrollTop: 0},0);
		}
	}

	$scope.getTemplate = function(tpl) {
		return 'app/webroot/js/angular/app/templates/'+tpl;
	}

	$scope.isLogged = function() {
		return userSv.isLogged();
	}

	$scope.logout = function() {
		window.location.href = '/users/logout';
	}

	$scope.manageControl = function() {
		$scope.showMenu = !$scope.showMenu;
		appSv.setDashboardMenuMode($scope.showMenu);
	}

	$scope.getHeaderClass = function() {

		if ($scope.showMenu) {

			return 'headerOpened';
		}

		return 'headerClosed';

	}

	$scope.getHeaderStyle = function() {

		if ($scope.showMenu) {

			return {
				'left': 0
			}
		}

		return {
			'left': '-' + ($scope.menuWidth - 50) + 'px'
		}

	}

	$scope.getContentStyle = function() {

		if (!$scope.isLogged()) {
			return {
				'width':'100%',
				'left':'0px'
			}
		}

		if ($scope.showMenu) {
			return {
				'width':'calc(100% - '+($scope.menuWidth) +'px)',
				'left' :$scope.menuWidth+'px'
			}
		}

		return {
			'width':'calc(100% - 50px)',
			'left':'50px'
		}

	}

	$scope.manageTour = function() {

		if ($scope.steps.accounts && $scope.steps.themes) {
			//return;
		}

		var timer = -1;

		if ((!angular.isDefined($scope.user.theme) || $scope.user.theme == 'digest' )
			&& userSv.getAccounts().length == 1) {

			$scope.steps.accounts = true;
			$scope.steps.themes = true;
			$scope.showPage('themes');
			timer = setTimeout(function(){
				clearTimeout(timer);
				$scope.showTour(5);
			},500);
			return;
		}

		$scope.steps.accounts = true;
		$scope.steps.themes = true;

		$scope.showPage('accounts');
		timer = setTimeout(function(){
			clearTimeout(timer);
			$scope.showTour(1);
		},500);
	}

	$scope.$watch('userSv.getUser()',function(user){
		$scope.user = user;
		console.log("AYTEMA ",$scope.user);
		if ($scope.isLogged() && !userSv.getAccounts().length) {
			userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});
		}
	},true);

	$scope.$watch('userSv.getAccounts()', function(value) {
		if (angular.isDefined(value) && value.length > 0) {
			$scope.manageTour();
		}
	});

	$scope.$watch('userSearch', function(value) {
		$scope.usersList = [];
		if (value.length > 0) {
			$scope.searchUsers();
		}
	});

	$scope.$watchCollection('[winW,winH]',function(sizes){
        appSv.setWidth(sizes[0]);
        appSv.setHeight(sizes[1]);
       	$scope.getMenuWidth();
    });

    $scope.showTour = function(step) {

    	if ($scope.tour) {
    		$scope.tour.end();
    	}

		$scope.tour = new Tour({
	  		name: "tour_"+$scope.user.username,
	  		keyboard: true,
	  		useLocalStorage: false,
		});

		$scope.tour.addStep({
			element: "#menu_help",
			placement: "right",
			title: "<strong>Welcome to your dashboard</strong>",
			content: ""
				+"<p>This is a tour about its customization!</p>"
				+"<p><strong>Step 1:</strong> Manage your content <i class='fa fa-users'></i></p>"
				+"<p><strong>Step 2:</strong> Choose a theme <i class='fa fa-files-o'></i></p>"
				+"<p><strong>Step 3:</strong> Share your profile <i class='fa fa-share-alt'></i></p>"
				+"<p>Use <i class='fa fa-arrows-h'></i> for a better experience.</p>"
			,
			animation: true,
  			onShow: function (tour) {
				angular.element(document.querySelector("#menu_accounts")).trigger("click");
 			},
		});

		$scope.tour.addStep({
			element: "#menu_accounts",
			placement: "right",
			title: "<strong>Step 1:</strong> Accounts <i class='fa fa-users'></i>",
			content: "Manage your own content and social accounts.",
			animation: true,
  			onShow: function (tour) {
  				angular.element(document.querySelector("#menu_accounts")).trigger("click");
 			},
		});

		$scope.tour.addStep({
			element: "#accountList li.cloudcialAccount",
			placement: "bottom",
			title: "<strong>Your CloudCial Account</strong> <i class='"+contentSv.getNetworkIcon('cloudcial')+"'></i>",
			content: ""
				+"<p>Try rollovering on this account and discover its options:</p>"
				+"<p><i class='fa fa-exclamation-circle'></i>: You can not delete it</p>"
				+"<p><i class='fa fa-search'></i>: Explore, add and edit your content</p>"
			,
			animation: true,
			onShow: function(tour) {
				angular.element(document.querySelector("#menu_accounts")).trigger("click");
				angular.element(document.querySelector("#accountList li.cloudcialAccount")).trigger("mouseover");
			}
		});

		$scope.tour.addStep({
			element: "#add_account",
			placement: "bottom",
			title: "<strong>Social accounts</strong> <i class='fa fa-plus'></i>",
			content: "<p>Add social accounts and import their content.</p>",
			animation: true,
			onShow: function(tour) {
				angular.element(document.querySelector("#menu_accounts")).trigger("click");
				angular.element(document.querySelector("#add_account")).trigger("click");
			},
			onHide: function(tour) {
				angular.element(document.querySelector("#add_account")).trigger("click");
			},
		});

		$scope.tour.addStep({
			element: "#filter_account",
			placement: "top",
			title: "<strong>Social accounts</strong> <i class='fa fa-search'></i>",
			content: "<p>Filter your account list by networks or text pattern.</p>",
			animation: true,
			onShow: function(tour) {
				angular.element(document.querySelector("#menu_accounts")).trigger("click");
				angular.element(document.querySelector("#filter_account")).trigger("click");
			},
			onHide: function(tour) {
				angular.element(document.querySelector("#filter_account")).trigger("click");
			},
		});

		$scope.tour.addStep({
			element: "#menu_themes",
			placement: "right",
			title: "<strong>Step 2:</strong> Choose a theme <i class='fa fa-files-o'></i>",
			content: ""
				+"<p>Browse our great themes</p>"
				+"<p><i class='fa fa-search'></i>: Theme Preview</p>"
				+"<p><i class='fa fa-cog'></i>: Full Edit</p>"
				+"<p><i class='fa fa-cogs'></i>: Use it on view edition to explore custom settings for your theme</p>"
			,
			animation: true,
			onShow: function (tour) {
				angular.element(document.querySelector("#menu_themes")).trigger("click");
			},
		});

		$scope.tour.addStep({
			element: "#theme_0",
			placement: "bottom",
			title: "<strong>Customize your theme</strong>",
			content: ""
				+"<p>Try rollovering on this theme and discover its options:</p>"
				+"<p><i class='fa fa-search'></i>: Theme Preview</p>"
				+"<p><i class='fa fa-cog'></i>: Full Edit</p>"
				+"<p><i class='fa fa-cogs'></i>: Use it on view edition to explore custom settings for your theme</p>"
			,
			animation: true,
			onShow: function (tour) {
				angular.element(document.querySelector("#menu_themes")).trigger("click");
			},
		});

		$scope.tour.addStep({
			element: "#menu_share",
			placement: "right",
			title: "<strong>Step 3:</strong> Share your profile <i class='fa fa-share-alt'></i>",
			content: "END!",
			animation: true,
			onShow: function (tour) {
				angular.element(document.querySelector("#menu_share")).trigger("click");
			},
		});

		$scope.tour.restart();
		$scope.tour.start(true);		
		if (angular.isDefined(step)) {
			$scope.tour.goTo(step);
			$scope.tour.setCurrentStep(step);
		}
    }

}