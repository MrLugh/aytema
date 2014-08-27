function adminStatsCo($scope,userSv,appSv,contentSv) {

	$scope.user 	= userSv.getUser();
	$scope.networks = appSv.getNetworks();
	$scope.appSv	= appSv;
    $scope.contentSv= contentSv;

	accountStats = false;

	userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});

	$scope.networksGraphData = function() {
		$scope.totalNetworks = {};
		$scope.totalAccounts = {};

        $scope.byNetworks    = {}

		for (var x in $scope.accounts) {
			var account = $scope.accounts[x]['Socialnet'];
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
                }
            },
            series: [{
                type: 'pie',
                name: 'Social Networks',
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
                }
            },
            series: [{
                type: 'pie',
                name: 'Social Stats',
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

    $( window ).resize(function() {
        $("#networkStats").highcharts(networkStats);
        $("#accountStats").highcharts(accountStats);
    });

}