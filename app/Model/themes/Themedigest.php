<?php

Class Themedigest {

    static $config = array(
        'filters' => array(
            'home'      => array(
                'concepts'  => array('all'),
            ),
            'videos'    => array(
                'concepts'  => array('video'),
            ),
            'tracks'    => array(
                'concepts'  => array('track'),
            ),            
            'photos'    => array(
                'concepts'  => array('photo'),
            ),
            'posts'     => array(
                'concepts'  => array('post','quote','chat'),
            )
        ),
        'contentsizes' => array(
            'facebook' => array(
                'photo'=>'medium',
                'post'=>'xlarge',
                'video'=>'xlarge',
            ),
            'twitter' => array(
                'post'=>'large',
            ),
            'tumblr' => array(
                'photo'=>'medium',
                'post'=>'medium',
                'chat'=>'small',
                'quote'=>'medium',
                'video'=>'large',
                'track'=>'large',
                'link'=>'medium',
            ),
            'soundcloud' => array(
                'track'=>'large',
            ),
            'mixcloud' => array(
                'track'=>'large',
            ),
            'youtube' => array(
                'video'=>'large',
            ),
            'vimeo' => array(
                'video'=>'large',
            ),
            'cloudcial'    => array(
                'photo'=>'medium',
                'post'=>'medium',
                'video'=>'large',
                'track'=>'large',
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
        'width' => '100%'
    );	
}