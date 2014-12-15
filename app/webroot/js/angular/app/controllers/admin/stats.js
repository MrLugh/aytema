function adminStatsCo($scope,userSv,appSv,contentSv) {

	$scope.user 	= userSv.getUser();
	$scope.networks = appSv.getNetworks();
	$scope.appSv	= appSv;
    $scope.contentSv= contentSv;

	accountStats = false;

    if (userSv.isLogged() && !userSv.getAccounts().length) {
        userSv.loadAccounts({username:userSv.getUser().username,status:'Allowed'});
    }

    Highcharts.theme = {
       colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
          "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
       chart: {
          backgroundColor: 'transparent',
          plotBorderColor: '#606063'
       },
       title: {
          style: {
             color: '#E0E0E3',
             textTransform: 'uppercase',
             fontSize: '20px'
          }
       },
       subtitle: {
          style: {
             color: '#E0E0E3',
             textTransform: 'uppercase'
          }
       },
       xAxis: {
          gridLineColor: '#707073',
          labels: {
             style: {
                color: '#E0E0E3'
             }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          title: {
             style: {
                color: '#A0A0A3'

             }
          }
       },
       yAxis: {
          gridLineColor: '#707073',
          labels: {
             style: {
                color: '#E0E0E3'
             }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          tickWidth: 1,
          title: {
             style: {
                color: '#A0A0A3'
             }
          }
       },
       tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          style: {
             color: '#F0F0F0'
          }
       },
       plotOptions: {
          series: {
             dataLabels: {
                color: '#B0B0B3'
             },
             marker: {
                lineColor: '#333'
             }
          },
          boxplot: {
             fillColor: '#505053'
          },
          candlestick: {
             lineColor: 'white'
          },
          errorbar: {
             color: 'white'
          }
       },
       legend: {
          itemStyle: {
             color: '#E0E0E3'
          },
          itemHoverStyle: {
             color: '#FFF'
          },
          itemHiddenStyle: {
             color: '#606063'
          }
       },
       credits: {
          enabled:false
       },
       labels: {
          style: {
             color: '#707073'
          }
       },

       drilldown: {
          activeAxisLabelStyle: {
             color: '#F0F0F3'
          },
          activeDataLabelStyle: {
             color: '#F0F0F3'
          }
       },

       navigation: {
          buttonOptions: {
             symbolStroke: '#DDDDDD',
             theme: {
                fill: '#505053'
             }
          }
       },

       // scroll charts
       rangeSelector: {
          buttonTheme: {
             fill: '#505053',
             stroke: '#000000',
             style: {
                color: '#CCC'
             },
             states: {
                hover: {
                   fill: '#707073',
                   stroke: '#000000',
                   style: {
                      color: 'white'
                   }
                },
                select: {
                   fill: '#000003',
                   stroke: '#000000',
                   style: {
                      color: 'white'
                   }
                }
             }
          },
          inputBoxBorderColor: '#505053',
          inputStyle: {
             backgroundColor: '#333',
             color: 'silver'
          },
          labelStyle: {
             color: 'silver'
          }
       },

       navigator: {
          handles: {
             backgroundColor: '#666',
             borderColor: '#AAA'
          },
          outlineColor: '#CCC',
          maskFill: 'rgba(255,255,255,0.1)',
          series: {
             color: '#7798BF',
             lineColor: '#A6C7ED'
          },
          xAxis: {
             gridLineColor: '#505053'
          }
       },

       scrollbar: {
          barBackgroundColor: '#808083',
          barBorderColor: '#808083',
          buttonArrowColor: '#CCC',
          buttonBackgroundColor: '#606063',
          buttonBorderColor: '#606063',
          rifleColor: '#FFF',
          trackBackgroundColor: '#404043',
          trackBorderColor: '#404043'
       },

       // special colors for some of the
       legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
       background2: '#505053',
       dataLabelsColor: '#B0B0B3',
       textColor: '#C0C0C0',
       contrastTextColor: '#F0F0F3',
       maskColor: 'rgba(255,255,255,0.3)'
    };

    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);


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
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                 color: '#F0F0F0'
                }                
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
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                 color: '#F0F0F0'
                }
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

	};

    $scope.contentsGraphData = function() {

        var months              = [];
        var concepts            = [];
        var conceptsStatsData   = [];

        angular.forEach($scope.contentStatsData, function(data,concept) {

            var row = {
                name:concept,
                data:[]
            }

            if (concepts.indexOf(concept) == -1) {
                concepts.push(concept);
            }

            angular.forEach(data, function(value,key) {
                row.data.push(value);
                if (months.indexOf(key) == -1) {
                    months.push(key);
                }
            });

            conceptsStatsData.push(row);

        });

        var contentStats = {
            chart: {
                type: 'area',
                zoomType: 'xy'
            },
            title: {
                text: 'Concepts counter'
            },
            xAxis: {
                categories: months,
                tickmarkPlacement: 'on',
                title: {
                    text: 'LAST YEAR IN MONTHS'
                }
            },
            yAxis: {
                title: {
                    text: 'TOTALS'
                }
            },
            tooltip: {
                shared: true,
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: conceptsStatsData
        }

        $("#contentStats").highcharts(contentStats);
    };

    $scope.getContent = function() {

        var params  = [];
        var networks= [];
        var accounts= [];
        var concepts= [];

        angular.forEach($scope.accounts, function(account,key) {

            if ($scope.filters.networks.indexOf(account.Socialnet.network) != -1) {

                if (networks.indexOf(account.Socialnet.network) == -1) {
                    networks.push(account.Socialnet.network);
                }
                if (accounts.indexOf(account.Socialnet.id) == -1) {
                    accounts.push(account.Socialnet.id);
                }

                for (var y in appSv.getNetworks()[account.Socialnet.network]['concepts']){
                    var concept = appSv.getNetworks()[account.Socialnet.network]['concepts'][y];
                    if (concepts.indexOf(concept) == -1){
                        concepts.push(concept);
                    }
                }

            }

        });

        params['concepts']  = concepts;
        params['networks']  = networks;
        params['accounts']  = accounts;
        params['status']    = 'enabled';

        contentSv.getStatsByFilters(params).then(
            function(data) {
                $scope.contentStatsData = data.stats;
                $scope.contentsGraphData();
            },
            function(reason) {
                //console.log('Failed: ', reason);
            },
            function(update) {
                //console.log('Got notification: ', update);
            }
        );
    };

	$scope.$watch('userSv.getAccounts()', function(value) {
		if (angular.isDefined(value) && value.length > 0) {
			$scope.accounts = value;
			$scope.networksGraphData();
            $scope.getContent();
		}
	},true);

    $scope.$watch('filters',function(){
        if (angular.isDefined($scope.accounts) && $scope.accounts.length) {
            $scope.getContent();
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