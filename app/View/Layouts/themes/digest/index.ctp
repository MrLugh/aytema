<!DOCTYPE html>
<html>
<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Digest Theme</title>
    <link href='http://fonts.googleapis.com/css?family=Playfair+Display+SC:400,400italic,700,700italic,900,900italic' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Playfair+Display:400,400italic,700,700italic,900,900italic' rel='stylesheet' type='text/css'>

    <!-- Css -->
    <?php
    echo $this->Html->css('bootstrap');
    echo $this->Html->css('font-awesome.min');
    echo $this->Html->css('themes/digest/estilos');
    ?>

    <!-- Js -->
    <?php
    echo $this->Html->script('jquery');
    echo $this->Html->script('modernizr.min.js');
    echo $this->Html->script('bootstrap');
    echo $this->Html->script('underscore.min');
    echo $this->Html->script('masonry.pkgd');
    echo $this->Html->script('imagesloaded.pkgd');
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
    echo $this->Html->script('angular/app/controllers/admin/accounts.js');
    echo $this->Html->script('angular/app/controllers/admin/themes.js');
    echo $this->Html->script('angular/app/controllers/admin/themes.js');
    echo $this->Html->script('angular/app/controllers/themes.js');

        // Themes
        echo $this->Html->script('angular/app/controllers/themes/digest.js');
        echo $this->Html->script('angular/app/controllers/themes/digest/content.js');      
    ?>

    <!-- Apps -->
    <?php
    echo $this->Html->script('angular/theme.js');
    ?>

    <!-- Directives -->
    <?php
    echo $this->Html->script('angular/app/directives/directives.js');
    echo $this->Html->script('angular/app/directives/login.js');
    echo $this->Html->script('angular/app/directives/aytema.js');
    echo $this->Html->script('angular/app/directives/admin/accounts.js');
    echo $this->Html->script('angular/app/directives/admin/themes.js');

        // Themes
        echo $this->Html->script('angular/app/directives/themes/digest/content.js');
    ?>

</head>

<body>

    <div data-ng-app="ayTemaThemeApp" controller='themeDigestCo' resize style="text-align:center;margin-left:auto;margin-right:auto;">
        <ng-view></ng-view>
    </div>

    <?php echo $this->element('sql_dump'); ?>

    <?php echo $this->fetch('content'); ?>

</body>
</html>