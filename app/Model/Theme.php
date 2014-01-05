<?php

App::import('model','YoutubeSocialnet');

Class Theme extends AppModel {

    static $default = 'digest';

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

	public function getThemeConfig($theme,$user_id) {

		try {

	        $config = $this->find('all', array(
	            'conditions'=> array('type'=>$theme,'user_id'=>$user_id),
	            'limit'     => 1,
	            )
	        );

	        if (empty($config)) {
	        	$config = self::$config;
	        } else {
                $config = unserialize($config[0]['Theme']['data']);
            }

            $config['user'] = $user_id;
            $config['type'] = $theme;

	        return $config;

		} catch(Exeption $e) {

		}

	}

    public function setThemeConfig($theme,$user_id,$config) {

        try {

            $save = $this->find('all', array(
                'conditions'=> array('type'=>$theme,'user_id'=>$user_id),
                'limit'     => 1,
                )
            );

            if (!empty($save)) {
                $update                 = array_shift($save);
                $save['id']             = $update['Theme']['id'];
            }
            $save['data']   = serialize($config);
            $save['user_id']= $user_id;
            $save['type']   = $theme;

            $new = new Theme();
            $new->save($save);
            return $this->getThemeConfig($theme,$user_id);

        } catch(Exeption $e) {

        }
    }


}