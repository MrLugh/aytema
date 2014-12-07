<?php

Class Themedigest {

    static $config = array(
        'filters' => array(
            'home'      => array(
                'concepts'  => array('all'),
                //'networks'  => array('cloudcial')
            ),
            'videos'    => array(
                'concepts'  => array('video'),
                //'networks'  => array('vimeo','youtube')
            ),
            'tracks'    => array(
                'concepts'  => array('track'),
                //'networks'  => array('soundcloud','mixcloud','tumblr')
            ),
            'photos'    => array(
                'concepts'  => array('photo'),
            ),
            'posts'     => array(
                'concepts'  => array('post','quote','chat'),
                //'networks'  => array('twitter','facebook','tumblr')
            )
        ),
        'contentsizes' => array(
            'facebook' => array(
                'photo'=>'medium',
                'post'=>'medium',
                'video'=>'medium',
            ),
            'twitter' => array(
                'post'=>'medium',
            ),
            'tumblr' => array(
                'photo'=>'medium',
                'post'=>'medium',
                'chat'=>'medium',
                'quote'=>'medium',
                'video'=>'medium',
                'track'=>'medium',
                'link'=>'medium',
            ),
            'soundcloud' => array(
                'track'=>'medium',
            ),
            'mixcloud' => array(
                'track'=>'medium',
            ),
            'youtube' => array(
                'video'=>'medium',
            ),
            'vimeo' => array(
                'video'=>'medium',
            ),
            'cloudcial'    => array(
                'photo'=>'medium',
                'post'=>'medium',
                'video'=>'medium',
                'track'=>'medium',
                'event'=>'medium',
            ),
        ),
        'colors' => array(
            'background' => array(
                'value' => '#F7F7F7',
                'label' => 'Body background',
            ),
            'contentBackground' => array(
                'value' => '#ffffff',
                'label' => 'Content background',
            ),
            'contentText' => array(
                'value' => '#000000',
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
            'selected'   => '/img/themes/digest/bg.png',
            'list' => array(
                'none'  => '',
                'dot'   => "/img/themes/digest/bg-dot.png",
                'mask'  => "/img/themes/digest/bg.png",
                'grey'  => "/img/themes/digest/bg.jpg"
            ),
        )
    );	
}