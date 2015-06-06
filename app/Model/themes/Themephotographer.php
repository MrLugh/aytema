<?php

Class Themephotographer {

    public $config = array(
        'text' => array(
            'headline' => "Photographer",
            'phone' => "(123) 456-7890"
        ),
    );

    public function getConfig() {
        return self::$config;
    }

}