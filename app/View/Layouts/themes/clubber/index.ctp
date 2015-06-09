<!DOCTYPE html>
<html>
<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9" />

    <meta property="fb:app_id" content="211895592326072">
    <meta property="og:title" content="Cloud Cial"/>
    <meta property="og:type" content="article"/>
    <meta property="og:site_name" content="CloudCial.com"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">

    <title>Clubber Theme</title>
    <!--
    <link href='http://fonts.googleapis.com/css?family=Playfair+Display+SC:400,400italic,700,700italic,900,900italic' rel='stylesheet' type='text/css'>
    -->
    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <link href='http://fonts.googleapis.com/css?family=Dosis' rel='stylesheet' type='text/css'>

    <!-- Css -->
    <?php
    echo $this->Html->css('bootstrap');
    echo $this->Html->css('font-awesome.min');
    echo $this->Html->css('minicolors');
    echo $this->Html->css('themes/clubber/bootstrap-overwrite');
    echo $this->Html->css('themes/clubber/estilos');
    echo $this->Html->css('themes/clubber/estilos-responsive');
    echo $this->Html->css('dropzone');
    echo $this->Html->css('admin');
    echo $this->Html->css('themes/clubber/pages/photos');
    echo $this->Html->css('themes/clubber/pages/videos');
    echo $this->Html->css('themes/clubber/pages/events');
    echo $this->Html->css('themes/clubber/pages/tracks');
    echo $this->Html->css('themes/clubber/pages/posts');
    echo $this->Html->css('themes/clubber/pages/events');
    echo $this->Html->css('themes/clubber/pages/photos-responsive');
    echo $this->Html->css('themes/clubber/pages/videos-responsive');
    echo $this->Html->css('themes/clubber/pages/events-responsive');
    echo $this->Html->css('themes/clubber/pages/tracks-responsive');
    echo $this->Html->css('themes/clubber/pages/posts-responsive');
    echo $this->Html->css('themes/clubber/fontello');
    echo $this->Html->css('animate');
    ?>

    <!-- Js -->
    <?php
    echo $this->Html->script('jquery');
    echo $this->Html->script('bootstrap');
    //echo $this->Html->script('modernizr.min');
    echo $this->Html->script('underscore.min');
    echo $this->Html->script('minicolors');
    echo $this->Html->script('masonry.pkgd');
    echo $this->Html->script('imagesloaded.pkgd');
    echo $this->Html->script('carouFredSel');
    echo $this->Html->script('touchSwipe.min');
    echo $this->Html->script('dropzone');
    echo $this->Html->script('countUp');
    ?>

    <!-- Config -->
    <?php
    echo $this->Html->script('angular/config');
    ?>

    <!-- Angular -->
    <?php
    echo $this->Html->script('angular/lib/angular');
    echo $this->Html->script('angular/lib/angular-route');
    echo $this->Html->script('angular/lib/angular-animate');
    echo $this->Html->script('angular/lib/angular-resource');
    echo $this->Html->script('angular/lib/angular-sanitize');
    echo $this->Html->script('angular/lib/angular-route');
    echo $this->Html->script('angular/lib/angular-touch');
    echo $this->Html->script('angular/lib/angular-cookies');
    ?>

    <!-- Filters -->
    <?php
    echo $this->Html->script('angular/app/filters/filters');
    ?>

    <!-- Services -->
    <?php
    echo $this->Html->script('angular/app/services/services');
    echo $this->Html->script('angular/app/services/app');
    echo $this->Html->script('angular/app/services/user');
    echo $this->Html->script('angular/app/services/content');
    ?>

    <!-- Controllers -->
    <?php
    echo $this->Html->script('angular/app/controllers/controllers');
    echo $this->Html->script('angular/app/controllers/app');
    echo $this->Html->script('angular/app/controllers/login');
    echo $this->Html->script('angular/app/controllers/admin/pagefilter');
    echo $this->Html->script('angular/app/controllers/admin/colors');
    echo $this->Html->script('angular/app/controllers/admin/fonts');
    echo $this->Html->script('angular/app/controllers/admin/width');
    echo $this->Html->script('angular/app/controllers/admin/background');

        // Themes
        echo $this->Html->script('angular/app/controllers/themes');
        echo $this->Html->script('angular/app/controllers/themes/clubber');
        echo $this->Html->script('angular/app/controllers/themes/clubber/content');
        echo $this->Html->script('angular/app/controllers/themes/clubber/related');
        echo $this->Html->script('angular/app/controllers/themes/clubber/latest/photos');
        echo $this->Html->script('angular/app/controllers/themes/clubber/latest/videos');
        echo $this->Html->script('angular/app/controllers/themes/clubber/latest/tracks');
        echo $this->Html->script('angular/app/controllers/themes/clubber/latest/posts');
        echo $this->Html->script('angular/app/controllers/themes/clubber/latest/events');
        echo $this->Html->script('angular/app/controllers/themes/clubber/pages/photos');
        echo $this->Html->script('angular/app/controllers/themes/clubber/pages/videos');
        echo $this->Html->script('angular/app/controllers/themes/clubber/pages/tracks');
        echo $this->Html->script('angular/app/controllers/themes/clubber/pages/posts');
        echo $this->Html->script('angular/app/controllers/themes/clubber/pages/events');        
    ?>

    <!-- Plugins -->
    <?php
    echo $this->Html->script('angular/plugins/ui-bootstrap/ui-bootstrap');
    echo $this->Html->script('angular/plugins/ui-bootstrap/ui-bootstrap-tpls');
    echo $this->Html->script('angular/plugins/angular-masonry/angular-masonry');
    ?>

    <!-- Apps -->
    <?php
    echo $this->Html->script('angular/theme');
    ?>

    <!-- Directives -->
    <?php
    echo $this->Html->script('angular/app/directives/directives');
    echo $this->Html->script('angular/app/directives/login');
    echo $this->Html->script('angular/app/directives/admin/pagefilter');
    echo $this->Html->script('angular/app/directives/admin/colors');
    echo $this->Html->script('angular/app/directives/admin/fonts');
    echo $this->Html->script('angular/app/directives/admin/width');
    echo $this->Html->script('angular/app/directives/admin/background');
        // Themes
        echo $this->Html->script('angular/app/directives/themes/clubber/index');
        echo $this->Html->script('angular/app/directives/themes/clubber/content');
        echo $this->Html->script('angular/app/directives/themes/clubber/latest');
        echo $this->Html->script('angular/app/directives/themes/clubber/pages');
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

    <div data-ng-app="ayTemaThemeApp" controller='themeClubberCo' user='<?php echo $user; ?>' resize>
        <ng-view></ng-view>
    </div>

    <?php echo $this->element('sql_dump'); ?>

    <?php echo $this->fetch('content'); ?>

</body>
</html>