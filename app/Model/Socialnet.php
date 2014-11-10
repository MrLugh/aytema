<?php

App::import('model','Content');
App::import('model','YoutubeSocialnet');
App::import('model','FacebookSocialnet');
App::import('model','InstagramSocialnet');
App::import('model','TwitterSocialnet');
App::import('model','TumblrSocialnet');
App::import('model','SoundcloudSocialnet');
App::import('model','VimeoSocialnet');
App::import('model','MixcloudSocialnet');

Class Socialnet extends AppModel {

	public static $networks = array(

		'youtube'		=> 'YouTube',
		'facebook'		=> 'FaceBook',
		//'instagram'		=> 'Instagram',
		'twitter'		=> 'Twitter',
		'tumblr'		=> 'Tumblr',
		'soundcloud'	=> 'SoundCloud',
		'vimeo'			=> 'Vimeo',
		'mixcloud'		=> 'MixCloud',

	);

	public static function getContentTypes($network) {

		try {

			$class = $network."socialnet";
			$object= new $class();
			return $object::$content_types;

		} catch(Exeption $e) {

		}

	}

	public static function factory($network, array $params = null) {

		try {

			$class = $network."socialnet";
			return new $class ($params);

		} catch(Exeption $e) {

		}

	}

	public function updateTotalStats($external_user_id,$network) {

		$Content = ClassRegistry::init('Content');

        $stats = $Content->find('all', array(
            'conditions'=> array('Content.network'=>$network,'Content.external_user_id'=>$external_user_id),
            'fields'	=> array('Content.concept','COUNT(Content.concept) as total'),
            'group'		=> 'Content.concept'
            )
        );

        $accountStats	= array();

        foreach ($stats as $key => $stat) {
			$accountStats[$stat['Content']['concept']] = $stat[0]['total'];
        }

        $socialnet = $this->find('first',array(
            'conditions'=> array('Socialnet.external_user_id'=>$external_user_id,'Socialnet.network'=>$network),
        ));

        $socialnet['Socialnet']['stats'] = json_encode($accountStats);
        $this->save($socialnet['Socialnet']);

	}

	public function setProfileImage($user_id,$path) {

		$net = ClassRegistry::init('Socialnet');

        $socialnet = $net->find('first',array(
            'conditions'=> array('Socialnet.user_id'=>$user_id,'Socialnet.network'=>'cloudcial'),
        ));

        $socialnet['Socialnet']['profile_image'] = $path;
        $net->save($socialnet['Socialnet']);
	}

}