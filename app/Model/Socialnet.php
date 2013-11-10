<?php

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

}