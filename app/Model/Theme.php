<?php

App::import('model','/themes/Themedigest');
App::import('model','/themes/Themesimple');
App::import('model','/themes/Themespace');
App::import('model','/themes/Themeclubber');
App::import('model','/themes/Themedj');
App::import('model','/themes/Themephotographer');

Class Theme extends AppModel {

    static $default = 'digest';

	public function getThemeConfig($theme,$user_id) {

		try {

	        $config = $this->find('all', array(
	            'conditions'=> array('Theme.type'=>$theme,'Theme.user_id'=>$user_id),
	            'limit'     => 1,
	            )
	        );

            $class = "Theme{$theme}";

	        if (empty($config)) {
	        	$config = $class::$config;
	        } else {
                //$config = unserialize($config[0]['Theme']['data']);
                $config = array_merge($class::$config,unserialize($config[0]['Theme']['data']));
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
                'conditions'=> array('Theme.type'=>$theme,'Theme.user_id'=>$user_id),
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

    public function removeUserConfig($type,$user_id) {

        try {

            $delete = $this->deleteAll(array('Theme.user_id'=>$user_id,'Theme.type !='=>$type));

        } catch(Exeption $e) {

        }
    }

}