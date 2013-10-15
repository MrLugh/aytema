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
    echo $this->Html->css('app');
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

<body data-ng-cloak>

<div class="navbar">
    <div class="navbar-inner">
        <div class="container-fluid">
            <ul class="nav">
                <li data-access-level='accessLevels.anon' active-nav>
                    <a href='/login'>Log in</a>
                </li>

                <li data-access-level='accessLevels.anon' active-nav>
                    <a href='/register'>Register</a>
                </li>

                <li data-access-level='accessLevels.user' active-nav>
                    <a href='/'>Home</a>
                </li>

                <li data-access-level='accessLevels.user' active-nav>
                    <a href='/private'>Private</a>
                </li>

                <li data-access-level='accessLevels.admin' active-nav>
                    <a href='/admin'>Admin</a>
                </li>

                <li data-access-level='accessLevels.user' active-nav>
                    <a href='' data-ng-click="logout()">Log out</a>
                </li>
            </ul>

            <div id="userInfo" class="pull-right" data-access-level='accessLevels.user'>
                Welcome&nbsp;
                <strong>{{ user.username }}&nbsp;</strong>
                <span class="label" data-ng-class='{"label-info": user.role.title == userRoles.user.title, "label-success": user.role.title == userRoles.admin.title}'>
                    {{ user.role.title }}
                </span>
            </div>

        </div>
    </div>
</div>


<div class="container">
    <div data-ng-view='ng-view'>
        <div class="alert alert-error" data-ng-bind="error" data-ng-show="error"></div>
    </div>
</div>


</body>
</html>