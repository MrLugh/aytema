<!DOCTYPE html>
<html data-ng-app="ayTemaApp">
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>AyTema</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- Css -->
    <?php
    echo $this->Html->css('bootstrap');
    echo $this->Html->css('font-awesome.min');
    ?>

    <!-- Js -->
    <?php
    echo $this->Html->script('jquery');   
    echo $this->Html->script('modernizr.min.js');
    echo $this->Html->script('bootstrap.min');
    echo $this->Html->script('underscore.min');
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

    <!-- Angular plugins -->
    <?php
    echo $this->Html->script('angular/plugins/angular-ui-router.js');
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
    ?>

    <!-- Apps -->
    <?php
    echo $this->Html->script('angular/app.js');
    ?>

    <!-- Directives -->
    <?php
    echo $this->Html->script('angular/app/directives/directives.js');
    ?>

    <script type="text/javascript"> 
        if (window.location.href.indexOf('#_=_') > 0) {
            window.location = window.location.href.replace(/#.*/, '');
        }
    </script>

</head>

<body>

    <div id="container">

        <div id="header">

        </div>

        <div id="content">
            <?php echo $this->fetch('content'); ?>
        </div>

        <div id="footer">

        </div>

    </div>

    <?php echo $this->element('sql_dump'); ?>


</body>
</html>