<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>CloudCial</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- Css -->
    <?php
    echo $this->Html->css('bootstrap');
    echo $this->Html->css('font-awesome.min');
    echo $this->Html->css('app');
    ?>

    <!-- Js -->
    <?php
    echo $this->Html->script('jquery');   
    echo $this->Html->script('modernizr.min.js');
    echo $this->Html->script('bootstrap.min');
    echo $this->Html->script('underscore.min');
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
    ?>

    <!-- Controllers -->
    <?php
    echo $this->Html->script('angular/app/controllers/controllers.js');
    echo $this->Html->script('angular/app/controllers/app.js');
    echo $this->Html->script('angular/app/controllers/login.js');
    echo $this->Html->script('angular/app/controllers/aytema.js');
    echo $this->Html->script('angular/app/controllers/admin/accounts.js');
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
    echo $this->Html->script('angular/app/directives/admin/accounts.js');
    ?>


</head>

<body>

    <div data-ng-app="ayTemaApp" controller='appCo'>
        <ng-view></ng-view>
    </div>

    <?php echo $this->element('sql_dump'); ?>

    <?php echo $this->fetch('content'); ?>

</body>
</html>