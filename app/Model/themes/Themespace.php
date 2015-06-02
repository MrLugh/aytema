<?php

Class Themespace {

    static $config = array(
        'colors' => array(
            'background' => array(
                'value' => '#ffffff',
                'label' => 'Body background',
            ),
            'contentBackground' => array(
                'value' => '#191719',
                'label' => 'Content background',
            ),
            'contentText' => array(
                'value' => '#262520',
                'label' => 'Content text',
            ),
        ),
        'fonts' => array(
            'selected' => array(
                'family'=> "'Ubuntu', sans-serif",
                'size'  => '13px',
            ),
            'list' => array(
                'Playfair Display' => "'Playfair Display', serif",
                'Open Sans' => "'Open Sans', sans-serif",
                'Josefin Sans' => "'Josefin Sans', sans-serif",
                'Asap' => "'Asap', sans-serif",
                'Ubuntu' => "'Ubuntu', sans-serif",
                'Raleway' => "'Raleway', sans-serif",
                'Lora' => "'Lora', serif",
                'Montserrat' => "'Montserrat', sans-serif",
                'Arvo' => "'Arvo', serif",
                'Junge' => "'Junge', serif"
            ),
        ),
        'width' => '100%',
        'background' => array(
            'selected'   => '',
            'list' => array(
                'none'      => '',
                'dot'       => "img/themes/space/bg-dot.png",
                'mask'      => "img/themes/space/bg.png",
                'grey'      => "img/themes/space/bg.jpg"
            ),
        )
    );

    public function getConfig() {
        return self::$config;
    }

}