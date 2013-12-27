<?php

App::import('model','YoutubeSocialnet');

Class Theme extends AppModel {

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
                'neworks'   => array('tumblr')
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
                'post'=>'medium',
            ),
            'tumblr' => array(
                'photo'=>'small',
                'post'=>'xlarge',
                'chat'=>'small',
                'quote'=>'medium',
                'video'=>'medium',
                'track'=>'medium',                
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
        )
    );

	public function getThemeConfig($theme,$user_id) {

		try {

	        $config = $this->find('all', array(
	            'conditions'=> array('type'=>$theme,'user_id'=>$user_id),
	            'limit'     => 1,
	            )
	        );

	        if (empty($config)) {
	        	$config = self::$config;
	        	$config['user'] = $user_id;
	        	$config['type'] = $theme;
	        }
	        return $config;

		} catch(Exeption $e) {

		}

	}


}