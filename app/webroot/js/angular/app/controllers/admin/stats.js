function adminStatsCo($scope,userSv,appSv,contentSv) {

	$scope.user 	= userSv.getUser();
	$scope.networks = appSv.getNetworks();
	$scope.appSv	= appSv;
    $scope.contentSv= contentSv;

	accountStats = false;

    if (userSv.isLogged() && !userSv.getAccounts().length) {
        userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});
    }

    $scope.initFilters = function() {

        var filters = {'networks':[]};

        for (x in $scope.networks){
            network = $scope.networks[x];
            filters['networks'].push(x);
        }

        $scope.filters = filters;
    }
    $scope.initFilters();

	$scope.networksGraphData = function() {
		$scope.totalNetworks = {};
		$scope.totalAccounts = {};

        $scope.byNetworks    = {}

		for (var x in $scope.accounts) {
			var account = $scope.accounts[x]['Socialnet'];

            if ($scope.filters.networks.indexOf(account.network) == -1) {
                continue;
            }

			var brand 	= $scope.networks[account.network]['brand'];

			if (!angular.isDefined($scope.totalNetworks[account.network])) {
				$scope.totalNetworks[account.network] = {
					key: account.network,
					name: brand,
					y	: 0
				}
			}
			$scope.totalNetworks[account.network].y++;

			for (var y in account.stats) {
				var stat = parseInt(account.stats[y]);
				if (!angular.isDefined($scope.totalAccounts[contentSv.getStatGroupName(y)])) {
					$scope.totalAccounts[contentSv.getStatGroupName(y)] = 0;
				}
				$scope.totalAccounts[contentSv.getStatGroupName(y)]++;

                if (!angular.isDefined($scope.byNetworks[account.network])) {
                    $scope.byNetworks[account.network] = {};
                }

                if (!angular.isDefined($scope.byNetworks[account.network][contentSv.getStatGroupName(y)])) {
                    $scope.byNetworks[account.network][contentSv.getStatGroupName(y)] = 0;
                }

                $scope.byNetworks[account.network][contentSv.getStatGroupName(y)]+= stat;

			}

		}

		networkStatsData  = [];
		accountStatsData  = [];
		networkColors     = [];

	    angular.forEach($scope.totalNetworks, function(network) {
	    	this.push(network);
	    	networkColors.push($scope.networks[network.key].color);
	    },networkStatsData);

	    angular.forEach($scope.totalAccounts, function(value,stat) {
	    	this.push([contentSv.getStatGroupName(stat),parseInt(value)]);
	    },accountStatsData);

		networkStats = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor:'transparent'
            },
            colors: networkColors,
			credits: {
				enabled: false
			},            
            title: {
                text: 'Social Networks'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: false,
                    dataLabels: {
                        style: {
                            color:'#fff'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Total',
                data: networkStatsData
            }]
        }

		accountStats = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor:'transparent'
            },
            colors: ["#0db8ff", "#fd3489", "#33dab8", "#b557fe", "#a9a9a9", "#eeff2b", "#647300", "#3581ff", "#ff802c", "#fc4040"],
			credits: {
				enabled: false
			},            
            title: {
                text: 'Social Stats'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: false,
                    dataLabels: {
                        style: {
                            color:'#fff'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Total',
                data: accountStatsData
            }]
        }        

        $("#networkStats").highcharts(networkStats);
        $("#accountStats").highcharts(accountStats);

	}

	$scope.$watch('userSv.getAccounts()', function(value) {
		if (angular.isDefined(value) && value.length > 0) {
			$scope.accounts = value;
			$scope.networksGraphData();
		}
	},true);

    $scope.manageFilters = function() {
        $scope.showFilters = !$scope.showFilters;
    }

    $scope.filter = function(index) {

        var account = $scope.networks[index];
        var networks= $scope.networks;

        var ixNetwork = $scope.filters.networks.indexOf(account.network);

        if (ixNetwork != -1) {
            delete $scope.filters.networks[ixNetwork];
        } else {
            $scope.filters.networks.push(account.network);
        }

        $scope.networksGraphData();
    }

    $scope.filterClass = function(network) {
        console.log(network);
        var ixNetwork = $scope.filters.networks.indexOf(network);
        if (ixNetwork == -1 ) {
            return "";
        }
        return "active";
    }

    $scope.matchBySearch = function(account) {

        if (!$scope.search.length) {
            return true;
        }

        var search = $scope.search.toLowerCase();

        if (account.login.toLowerCase().indexOf(search) != -1 || 
            account.external_user_id.toLowerCase().indexOf(search) != -1 || 
            account.type.toLowerCase().indexOf(search) != -1
            ) {

            return true;
        }

        return false;
    }    

}