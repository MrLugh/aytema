<?php

Class Themeclubber {

    static $config = array(
        'filters' => array(
            'photos'    => array(
                'concepts'  => array('photo'),
            ),
            'videos'    => array(
                'concepts'  => array('video'),
                //'networks'  => array('youtube','vimeo','tumblr')
            ),
            'tracks'    => array(
                'concepts'  => array('track'),
            ),
            'events'    => array(
                'concepts'  => array('event'),
            ),
            'posts'     => array(
                'concepts'  => array('post','quote','chat'),
                //'networks'  => array('twitter','facebook','tumblr')
            ), 
        ),
        'colors' => array(
            'background' => array(
                'value' => '#AD9E97',
                'label' => 'Body background',
            ),
            'contentBackground' => array(
                'value' => '#292D2E',
                'label' => 'Content background',
            ),
            'contentText' => array(
                'value' => '#14A664',
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
            'selected'   => '/img/themes/clubber/bg.png',
            'list' => array(
                'none'  => '',
                'dot'   => '/img/themes/clubber/bg-dot.png',
                'mask'  => '/img/themes/clubber/bg.png',
                'grey'  => '/img/themes/clubber/bg.jpg'
            ),
        )
    );


}