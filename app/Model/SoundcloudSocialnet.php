<?php

App::import('Vendor', 'soundcloud', array('file' => 'php-soundcloud-master/Soundcloud.php'));

Class SoundcloudSocialnet {

	const AUTHORIZE_HOST	= "https://soundcloud.com/connect";
	const ACCESS_TOKEN_HOST	= "https://api.soundcloud.com/oauth2/token";

	//Esto va al config!
	const APP_ID 			= "b0b6e1bfc6ac107fe7804f0dd6083538";
	const APP_SECRET 		= "5e5e7cdfb18e7687a5a189f4e4dfa603";
	const APP_PERMS 		= "non-expiring";
	const APP_CALLBACK 		= "http://cloudcial.com/soundcloud/addAccount";
	const API_URL 			= "http://soundcloud.com/";

	static $content_types	= array('track');

	public function __construct($data = array()) {

		$this->soundcloud = new Services_Soundcloud( self::APP_ID, self::APP_SECRET, self::APP_CALLBACK);
	}

	public function getAuthorizeUrl() {

		$url = 	self::AUTHORIZE_HOST . 
				'?client_id=' . self::APP_ID .
				'&scope=' . self::APP_PERMS .
				'&response_type=code' .
				'&redirect_uri=' . self::APP_CALLBACK;

		return $url;	
	}

	public function getAccessTokenUrl($code) {
		
		$url = 	self::ACCESS_TOKEN_HOST . 
				'?client_id=' . self::APP_ID .
				'&client_secret=' . self::APP_SECRET .
				'&grant_type=authorization_code' .
				'&code=' . $code .
				'&redirect_uri=' . self::APP_CALLBACK;

		return $url;	
	}	

	public function allowAccessToken($code) {

		$post = str_replace(self::ACCESS_TOKEN_HOST,'',$this->getAccessTokenUrl($code));
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->getAccessTokenUrl($code));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_TIMEOUT, 50);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1");
		curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Length: ".strlen($post)));
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post); 
		

		$response 	= curl_exec($ch);
		$errno 		= curl_errno($ch);
		$error 		= curl_error($ch);
		$info 		= curl_getinfo($ch);

		$hash = array();
		if( ($errno == CURLE_OK) && ($info['http_code'] == 200)) {
			$hash = json_decode($response,true);
		}

		return $hash;
	}

	public function profile($token,$user='me') {

		if (!empty($token)) {
			$this->soundcloud->setAccessToken($token);
		}
		return json_decode($this->soundcloud->get("users/{$user}.json"),true);
	}

	protected function processApiParams( $params ) {

		$api_params = array();
		 
		(!empty($params['since'])) ? $api_params['created_at[from]'] = $params['since'] : null;

		return $api_params;
	}

	/* COLLECT METHODS */

	public function stats($token,$user='me') {

		$user = $this->profile($token,$user);
		$stats= array();
		if (isset($user['track_count'])) {
			$stats['tracks'] = $user['track_count'];
		}
		if (isset($user['playlist_count'])) {
			$stats['playlists'] = $user['playlist_count'];
		}
		if (isset($user['followers_count'])) {
			$stats['followers'] = $user['followers_count'];
		}
		if (isset($user['subscriptions'])) {
			$stats['subscriptions'] = count($user['subscriptions']);
		}
		return $stats;
	}

	public function getContent($username,$concept,$id) {

		return self::API_URL."{$username}/{$id}";
	}

	public function getTracks($account, $params = array()) {

		$this->soundcloud->setAccessToken($account['token']);

		$path	= "users/{$account['external_user_id']}/tracks";

		$params = $this->processApiParams($params);
	
		return json_decode($this->soundcloud->get($path, $params),true);
	}

	/** Public methods **/
	public function validateFollow($username) {
		try {
			$user = json_decode($this->soundcloud->get("users/{$username}.json"),true);
		} catch (Exception $e) {
			$user = array();
		}
		return $user;
	}



}