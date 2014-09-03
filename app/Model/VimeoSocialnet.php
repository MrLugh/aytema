<?php

App::import('Vendor', 'vimeo', array('file' => 'vimeo/vimeo.php'));

Class VimeoSocialnet extends AppModel {

	const REQUEST_TOKEN_HOST 	= "https://vimeo.com/oauth/request_token";
	const ACCESS_TOKEN_HOST		= "https://vimeo.com/oauth/access_token";
	const AUTHORIZE_TOKEN_HOST 	= "https://vimeo.com/oauth/authorize";
	const VERIFY_CREDENTIALS	= "https://api.vimeo.com/1.1/account/verify_credentials.json";
	const UPDATE_STATUS			= "https://api.vimeo.com/1.1/statuses/update.json";
	const STATUS				= "https://api.vimeo.com/1.1/statuses";
	const USER_DATA				= 'https://api.vimeo.com/1.1/users/show.json';
	const APP_CALLBACK 			= "http://cloudcial.com/vimeo/addAccount";

	//Esto va al config!
	const APP_ID 			= "b6faa32ad34bfdfad0f3a53d39d0ec25a4d18cb7";
	const APP_SECRET 		= "2094203347c3141b0c0aba804d06c355a55a4b10";

	static $content_types	= array('video');

	public function __construct($data = array()) {

		$this->vimeo = new phpVimeo(self::APP_ID, self::APP_SECRET);
	}


	public function getRequestToken() {

		return $this->vimeo->getRequestToken();
	}

	public function getAuthorizeUrl($token) {

		return $this->vimeo->getAuthorizeUrl($token, 'write');
	}

	public function setToken($token, $secret) {

		$this->vimeo->setToken($token, $secret);
	}	

	public function getAccessToken($token,$verfier,$secret) {

		$this->vimeo->setToken($token,$secret);
		return $this->vimeo->getAccessToken($verfier);
	}

	public function verifyCredentials($account, $params = array()) {

		if (!empty($account)) {
			$this->setToken($account['token'], $account['secret']);
		}

		try {
			$args = array();

			if (isset($params['username'])) {
				$args = array('user_id'=>$params['username']);
			}

  			return json_decode(json_encode($this->vimeo->call("vimeo.people.getInfo",$args)),true);			
  		} catch(Exception $e) {
  			return null;
  		}

	}	

	/* COLLECT METHODS */

	public function stats($account, $params = array()) {
		$user = $this->verifyCredentials($account,$params);
		$stats= array();
		if (isset($user['person']['number_of_contacts'])) {
			$stats['contacts'] = $user['person']['number_of_contacts'];
		}
		if (isset($user['person']['number_of_likes'])) {
			$stats['likes'] = $user['person']['number_of_likes'];
		}
		if (isset($user['person']['number_of_videos'])) {
			$stats['videos'] = $user['person']['number_of_videos'];
		}
		if (isset($user['person']['number_of_albums'])) {
			$stats['albums'] = $user['person']['number_of_albums'];
		}
		if (isset($user['person']['number_of_channels'])) {
			$stats['channels'] = $user['person']['number_of_channels'];
		}
		return $stats;		
	}

	public function getVideos($account, $params = array()) {

		$this->vimeo->setToken($account['token'], $account['secret']);
		
		try {
			$params = array(
				"full_response"		=> true,
				"summary_response"	=> true,
				'user_id'			=> $account['external_user_id']
			);
  			return json_decode(json_encode($this->vimeo->call('vimeo.videos.getAll',$params)),true);
  		} catch(Exception $e) {
  			return null;
  		}		

	}

}