<?php

Class Themespace {

    static $config = array(
        'colors' => array(
            'background' => array(
                'value' => '#101010',
                'label' => 'Body background',
            ),
            'contentBackground' => array(
                'value' => '#303030',
                'label' => 'Content background',
            ),
            'contentText' => array(
                'value' => '#ffffff',
                'label' => 'Content text',
            ),
        ),
        'fonts' => array(
            'selected' => array(
                'family'=> "'Playfair Display', serif",
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
            'selected'   => 'img/themes/space/bg-dot.png',
            'list' => array(
                'dot'       => "img/themes/space/bg-dot.png",
                'mask'      => "img/themes/space/bg.png",
            ),
        )
    );


}