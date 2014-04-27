<?php

Class Themeclubber {

    static $config = array(
        'filters' => array(
            'photos'    => array(
                'concepts'  => array('photo'),
            ),
            'posts'     => array(
                'concepts'  => array('post','quote','chat'),
                //'networks'  => array('twitter')
            ),
            'videos'    => array(
                'concepts'  => array('video'),
                'networks'  => array('youtube','vimeo','tumblr')
            ),
            'events'    => array(
                'concepts'  => array('event'),
            ),                        
            'tracks'    => array(
                'concepts'  => array('track'),
            ),
        ),        
        'colors' => array(
            'background' => array(
                'value' => '#101010',
                'label' => 'Body background',
            ),
            'contentBackground' => array(
                'value' => '#02c0f8',
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
        'width' => '100%'
    );


}