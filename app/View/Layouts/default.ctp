<!DOCTYPE html>
<html>

<head>
        
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>AyTema</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <!-- Angular -->
        <?php
        echo $this->Html->script('angular/lib/angular.js');
        echo $this->Html->script('angular/lib/angular-route.js');
        echo $this->Html->script('angular/lib/angular-animate.js');
        echo $this->Html->script('angular/lib/angular-resource.js');
        echo $this->Html->script('angular/lib/angular-sanitize.js');
        echo $this->Html->script('angular/lib/angular-route.js');
        echo $this->Html->script('angular/lib/angular-touch.js');
        ?>

        <!-- Filters -->
        <?php
        echo $this->Html->script('angular/app/filters/filters.js');
        ?>

        <!-- Services -->
        <?php
        echo $this->Html->script('angular/app/services/services.js');
        ?>

        <!-- Controllers -->
        <?php
        echo $this->Html->script('angular/app/controllers/controllers.js');
        echo $this->Html->script('angular/app/controllers/index.js');
        ?>

        <!-- Apps -->
        <?php
        echo $this->Html->script('angular/app.js');
        ?>

        <!-- Directives -->
        <?php
        echo $this->Html->script('angular/app/directives/directives.js');
        ?>


</head>

<body>
        <h1>AyTema!</h1>

        <div data-ng-app="ayTemaApp" ng-controller='indexCo'>

                <ng-view></ng-view>

        </div>

</body>

</html>