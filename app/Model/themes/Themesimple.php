<?php

Class Themesimple {

    static $config = array(
        'colors' => array(
            'background' => array(
                'value' => '#1A2536',
                'label' => 'Body background',
            ),
            'contentBackground' => array(
                'value' => '#36465d',
                'label' => 'Content background',
            ),
            'contentText' => array(
                'value' => '#ffffff',
                'label' => 'Content text',
            ),
            'title' => array(
                'value' => '#CC5425',
                'label' => 'Title',
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
        'background' => array(
            'selected'   => '/img/themes/simple/bg.png',
            'list' => array(
                'none'  => '',
                'dot'   => '/img/themes/simple/bg-dot.png',
                'mask'  => '/img/themes/simple/bg.png',
                'grey'  => '/img/themes/simple/bg.jpg'
            ),
        )
    );


}