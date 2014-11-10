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
    echo $this->Html->script('angular/app/controllers/aytema.js');
    echo $this->Html->script('angular/app/controllers/admin/settings.js');
    echo $this->Html->script('angular/app/controllers/admin/accounts.js');
    echo $this->Html->script('angular/app/controllers/admin/account.js');
    echo $this->Html->script('angular/app/controllers/admin/content.js');
    echo $this->Html->script('angular/app/controllers/admin/themes.js');
    echo $this->Html->script('angular/app/controllers/admin/stats.js');
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
    echo $this->Html->script('angular/app/directives/aytema.js');
    echo $this->Html->script('angular/app/directives/admin/settings.js');
    echo $this->Html->script('angular/app/directives/admin/accounts.js');
    echo $this->Html->script('angular/app/directives/admin/account.js');
    echo $this->Html->script('angular/app/directives/admin/content.js');
    echo $this->Html->script('angular/app/directives/admin/themes.js');
    echo $this->Html->script('angular/app/directives/admin/stats.js');
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

    <div data-ng-app="ayTemaApp" user='<?php echo !empty($user) ? json_encode($user) : "{}"; ?>' controller='appCo' resize>
        <ng-view></ng-view>
    </div>

    <?php echo $this->element('sql_dump'); ?>

    <?php echo $this->fetch('content'); ?>

</body>
</html>