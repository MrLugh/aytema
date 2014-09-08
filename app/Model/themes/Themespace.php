<?php

Class Themespace {

    static $config = array(
        'colors' => array(
            'background' => array(
                'value' => '#A69E9E',
                'label' => 'Body background',
            ),
            'contentBackground' => array(
                'value' => '#3B3232',
                'label' => 'Content background',
            ),
            'contentText' => array(
                'value' => '#F7F1E6',
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
            'selected'   => '/img/themes/space/bg.jpg',
            'list' => array(
                'dot'       => "img/themes/space/bg-dot.png",
                'mask'      => "img/themes/space/bg.png",
                'grey'      => "img/themes/space/bg.jpg"
            ),
        )
    );


}