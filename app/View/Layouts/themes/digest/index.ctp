<!DOCTYPE html>
<html>
<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <meta property="fb:app_id" content="211895592326072">
    <meta property="og:title" content="Ay Tema"/>
    <meta property="og:type" content="article"/>
    <meta property="og:site_name" content="aytema.com"/>

    <title>Digest Theme</title>
    <!--
    <link href='http://fonts.googleapis.com/css?family=Playfair+Display+SC:400,400italic,700,700italic,900,900italic' rel='stylesheet' type='text/css'>
    -->
    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <script type="text/javascript">
      WebFontConfig = {
        google: { families: [ 'Playfair+Display:400,400italic,700,700italic:latin', 'Open+Sans:400,400italic,700,700italic:latin', 'Josefin+Sans:400,400italic,700,700italic:latin', 'Asap:400,400italic,700,700italic:latin', 'Ubuntu:400,400italic,700,700italic:latin', 'Raleway:400,700:latin', 'Lora:400,400italic,700,700italic:latin', 'Montserrat:400,700:latin', 'Arvo:400,400italic,700,700italic:latin', 'Junge::latin' ] }
      };
      (function() {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
          '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
      })();
    </script>

    <!-- Css -->
    <?php
    echo $this->Html->css('bootstrap');
    echo $this->Html->css('font-awesome.min');
    echo $this->Html->css('minicolors');
    echo $this->Html->css('themes/digest/estilos');
    echo $this->Html->css('themes/digest/detalle');
    echo $this->Html->css('themes/digest/admin');
    ?>

    <!-- Js -->
    <?php
    echo $this->Html->script('jquery');
    echo $this->Html->script('modernizr.min');
    echo $this->Html->script('bootstrap');
    echo $this->Html->script('underscore.min');
    echo $this->Html->script('minicolors');
    echo $this->Html->script('masonry.pkgd');
    echo $this->Html->script('imagesloaded.pkgd');
    echo $this->Html->script('carouFredSel');
    echo $this->Html->script('touchSwipe.min');
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
    echo $this->Html->script('angular/app/controllers/aytema');
    echo $this->Html->script('angular/app/controllers/admin/accounts');
    echo $this->Html->script('angular/app/controllers/admin/themes');
    echo $this->Html->script('angular/app/controllers/admin/pagefilter');
    echo $this->Html->script('angular/app/controllers/admin/contentsize');
    echo $this->Html->script('angular/app/controllers/admin/colors');
    echo $this->Html->script('angular/app/controllers/admin/fonts');
    echo $this->Html->script('angular/app/controllers/themes');

        // Themes
        echo $this->Html->script('angular/app/controllers/themes/digest');
        echo $this->Html->script('angular/app/controllers/themes/digest/content');      
    ?>

    <!-- Apps -->
    <?php
    echo $this->Html->script('angular/theme');
    ?>

    <!-- Directives -->
    <?php
    echo $this->Html->script('angular/app/directives/directives');
    echo $this->Html->script('angular/app/directives/login');
    echo $this->Html->script('angular/app/directives/aytema');
    echo $this->Html->script('angular/app/directives/admin/accounts');
    echo $this->Html->script('angular/app/directives/admin/themes');
    echo $this->Html->script('angular/app/directives/admin/pagefilter');
    echo $this->Html->script('angular/app/directives/admin/contentsize');
    echo $this->Html->script('angular/app/directives/admin/colors');
    echo $this->Html->script('angular/app/directives/admin/fonts');

        // Themes
        echo $this->Html->script('angular/app/directives/themes/digest/content');
    ?>

</head>

<body>

    <div data-ng-app="ayTemaThemeApp" controller='themeDigestCo' user="<?php echo $user; ?>"  resize style="text-align:center;margin-left:auto;margin-right:auto;">
        <ng-view></ng-view>
    </div>

    <?php echo $this->element('sql_dump'); ?>

    <?php echo $this->fetch('content'); ?>

</body>
</html>