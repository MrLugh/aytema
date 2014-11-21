<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>CloudCial</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Sofia' rel='stylesheet' type='text/css'>

    <!-- Css -->
    <?php
    echo $this->Html->css('bootstrap');
    echo $this->Html->css('bootstrap-tour-standalone');
    echo $this->Html->css('font-awesome.min');
    echo $this->Html->css('app');
    echo $this->Html->css('app-responsive');
    echo $this->Html->css('settings');
    echo $this->Html->css('settings-responsive');
    echo $this->Html->css('accounts');
    echo $this->Html->css('accounts-responsive');
    echo $this->Html->css('themes');
    echo $this->Html->css('themes-responsive');
    echo $this->Html->css('stats');
    echo $this->Html->css('stats-responsive');
    echo $this->Html->css('share');
    echo $this->Html->css('share-responsive');
    echo $this->Html->css('users');
    echo $this->Html->css('users-responsive');
    echo $this->Html->css('socialnets');
    echo $this->Html->css('socialnets-responsive');
    echo $this->Html->css('dropzone');
    ?>

    <!-- Js -->
    <?php
    echo $this->Html->script('jquery');
    echo $this->Html->script('bootstrap');
    echo $this->Html->script('bootstrap-tour-standalone');
    echo $this->Html->script('modernizr.min.js');
    echo $this->Html->script('underscore.min');
    echo $this->Html->script('masonry.pkgd');
    echo $this->Html->script('imagesloaded.pkgd');
    echo $this->Html->script('carouFredSel');
    echo $this->Html->script('countUp');
    echo $this->Html->script('tinymce/tinymce.min');
    echo $this->Html->script('highcharts');
    echo $this->Html->script('dropzone');
    ?>

    <!-- Config -->
    <?php
    echo $this->Html->script('angular/config.js');
    ?>

    <!-- Angular -->
    <?php
    echo $this->Html->script('angular/lib/angular.js');
    echo $this->Html->script('angular/lib/angular-route.js');
    echo $this->Html->script('angular/lib/angular-animate.js');
    echo $this->Html->script('angular/lib/angular-resource.js');
    echo $this->Html->script('angular/lib/angular-sanitize.js');
    echo $this->Html->script('angular/lib/angular-route.js');
    echo $this->Html->script('angular/lib/angular-touch.js');
    echo $this->Html->script('angular/lib/angular-cookies.js');
    ?>

    <!-- Filters -->
    <?php
    echo $this->Html->script('angular/app/filters/filters.js');
    ?>

    <!-- Services -->
    <?php
    echo $this->Html->script('angular/app/services/services.js');
    echo $this->Html->script('angular/app/services/app.js');
    echo $this->Html->script('angular/app/services/user.js');
    echo $this->Html->script('angular/app/services/content.js');
    ?>

    <!-- Controllers -->
    <?php
    echo $this->Html->script('angular/app/controllers/controllers.js');
    echo $this->Html->script('angular/app/controllers/app.js');
    echo $this->Html->script('angular/app/controllers/login.js');
    echo $this->Html->script('angular/app/controllers/admin/settings.js');
    echo $this->Html->script('angular/app/controllers/admin/accounts.js');
    echo $this->Html->script('angular/app/controllers/admin/account.js');
    echo $this->Html->script('angular/app/controllers/admin/content.js');
    echo $this->Html->script('angular/app/controllers/admin/themes.js');
    echo $this->Html->script('angular/app/controllers/admin/stats.js');
    echo $this->Html->script('angular/app/controllers/admin/share.js');
    echo $this->Html->script('angular/app/controllers/themes.js');
    echo $this->Html->script('angular/app/controllers/cloudcial/cloudcial.js');
    echo $this->Html->script('angular/app/controllers/cloudcial/users.js');
    echo $this->Html->script('angular/app/controllers/cloudcial/socialnets.js');
    echo $this->Html->script('angular/app/controllers/cloudcial/socialnet.js');
    echo $this->Html->script('angular/app/controllers/cloudcial/content.js');

        // Themes
    echo $this->Html->script('angular/app/controllers/themes/digest.js');
    ?>

    <!-- Plugins -->
    <?php
    echo $this->Html->script('angular/plugins/ui-bootstrap/ui-bootstrap');
    echo $this->Html->script('angular/plugins/ui-bootstrap/ui-bootstrap-tpls');
    echo $this->Html->script('angular/plugins/ui-tinymce/tinymce');
    ?>

    <!-- Apps -->
    <?php
    echo $this->Html->script('angular/app.js');
    ?>

    <!-- Directives -->
    <?php
    echo $this->Html->script('angular/app/directives/directives.js');
    echo $this->Html->script('angular/app/directives/login.js');
    echo $this->Html->script('angular/app/directives/admin/settings.js');
    echo $this->Html->script('angular/app/directives/admin/accounts.js');
    echo $this->Html->script('angular/app/directives/admin/account.js');
    echo $this->Html->script('angular/app/directives/admin/content.js');
    echo $this->Html->script('angular/app/directives/admin/themes.js');
    echo $this->Html->script('angular/app/directives/admin/stats.js');
    echo $this->Html->script('angular/app/directives/admin/share.js');
    echo $this->Html->script('angular/app/directives/cloudcial/content.js');
    ?>

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-56607948-1', 'auto');
      ga('send', 'pageview');

    </script>

</head>

<body>

    <div id="container" data-ng-app="ayTemaApp" user='<?php echo !empty($user) ? json_encode($user) : "{}"; ?>' ng-controller='appCo' resize>

        <div ng-show="userSv.isLogged()">

            <div id="cloudcial_loading">

                <div>

                    <div class="loading_bg"></div>
                    <div class="loading_img"></div>

                </div>

            </div>

            <div id="header" ng-style="getHeaderStyle()" ng-class="getHeaderClass()" get-menu-width>

                <div id="menuControl">
                    <i class="fa fa-align-justify" tooltip="Menu" tooltip-placement="bottom" ng-click="manageControl()"></i>
                </div>

                <div class="container" ng-style="getMenuContainerStyle()">

                    <a href="#" class="navbar-brand">{{user.username}}</a>

                    <ul class="menu">

                        <li id="menu_settings" ng-click="showPage('settings')" class="{{currentPage == 'settings' ? 'active':''}}" tooltip="Settings" tooltip-placement="right">
                            <i class="fa fa-cogs"></i>
                            <a href="#/settings" skip-default>Settings</a>
                        </li>

                        <li id="menu_accounts" ng-if="steps.accounts" ng-click="showPage('accounts')" class="{{currentPage == 'accounts' ? 'active':''}}" tooltip="Accounts" tooltip-placement="right">
                            <i class="fa fa-users"></i>
                            <a href="#/accounts" skip-default>Accounts</a>
                        </li>

                        <li id="menu_themes" ng-if="steps.themes" ng-click="showPage('themes')" class="{{currentPage == 'themes' ? 'active':''}}" tooltip="Themes" tooltip-placement="right">
                            <i class="fa fa-files-o"></i>
                            <a href="#/themes" skip-default>Themes</a>
                        </li>

                        <li id="menu_stats" ng-if="steps.accounts && steps.themes" ng-click="showPage('stats')" class="{{currentPage == 'stats' ? 'active':''}}" tooltip="Stats" tooltip-placement="right">
                            <i class="fa fa-bar-chart-o"></i>
                            <a href="#/stats" skip-default>Stats</a>
                        </li>

                        <li id="menu_share" ng-if="steps.accounts && steps.themes" ng-click="showPage('share')" class="{{currentPage == 'share' ? 'active':''}}" tooltip="Share" tooltip-placement="right">
                            <i class="fa fa-share-alt"></i>
                            <a href="#/share" skip-default>Share</a>
                        </li>

                        <li id="menu_help" ng-click="showTour()" tooltip="Start tour" tooltip-placement="right">
                            <i class="fa fa-life-ring"></i>
                            <a href="#/share" skip-default>Help</a>
                        </li>

                        <li ng-click="userSv.logout()" tooltip="Logout" tooltip-placement="right">
                            <i class="fa fa-sign-out"></i>
                            <a href="#/" ng-click="userSv.logout()" skip-default>LogOut</a>
                        </li>

                    </ul>

                    <form class="navbar-form navbar-left" role="search" style="position:relative;">
                        <div class="">
                            <input type="text" ng-model="userSearch" name="userSearch" placeholder="Search users" class="form-control">
                        </div>
                        <div ng-if="usersList.length > 0" style="position:absolute;height:100%;z-index:10;">
                            <ul class="nav navbar-nav usersSearch">
                                <li class="dropdown active open">
                                    <ul class="dropdown-menu">
                                        <li ng-repeat="userFind in usersList" class="userFind">
                                            <a href="/users/{{userFind.username}}" tabindex="-1" class="ajax">{{userFind.username}}</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </form>

                    <a class="cloudcial_logo" href="http://cloudcial.com">
                        <img ng-show="showMenu" src="/img/cloudcial-horizontal-white.png" />
                    </a>

                </div>

            </div>

            <div id="content"  ng-style="getContentStyle()">

                <ng-view></ng-view>

            </div>

            <div id="footer"></div>

        </div>

        <login ng-show="!userSv.isLogged()"></login>

    </div>

    <?php echo $this->element('sql_dump'); ?>

    <?php echo $this->fetch('content'); ?>

</body>
</html>