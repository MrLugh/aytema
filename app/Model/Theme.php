<?php

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
            ),
            'soundcloud' => array(
                'track'=>'small',
            ),
            'mixcloud' => array(
                'track'=>'small',
            ),
            'youtube' => array(
                'video'=>'medium',
            ),
            'vimeo' => array(
                'video'=>'medium',
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