<?php

App::import('Vendor', 'facebook', array('file' => 'facebook-php-sdk-master/facebook.php'));

Class FacebookSocialnet {

	const AUTHORIZE_HOST	= "https://graph.facebook.com/oauth/authorize";
	const ACCESS_TOKEN_HOST	= "https://graph.facebook.com/oauth/access_token";

	//Esto va al config!
	const APP_ID 			= "798764866832784";
	const APP_SECRET 		= "bcd9845622eacd63d5ed522e0586f246";
	const APP_PERMS 		= "publish_stream,offline_access,manage_pages,user_photos";
	const APP_CALLBACK 		= "http://cloudcial.com/facebook/addAccount";

	static $content_types	= array('photo','video','post');

	public function __construct($data = array()) {

		$this->facebook = new Facebook( array('appId' => self::APP_ID, 'secret' => self::APP_SECRET ));
	}

	public function getAuthorizeUrl() {

		$url = 	self::AUTHORIZE_HOST .
				'?client_id=' . self::APP_ID .
				'&scope=' . self::APP_PERMS .
				'&redirect_uri=' . self::APP_CALLBACK;
		
		return $url;

	}

	public function getAccessTokenUrl($code) {

		$url = 	self::ACCESS_TOKEN_HOST . 
				'?client_id=' . self::APP_ID .
				'&client_secret=' . self::APP_SECRET .
				'&code=' . $code .
				'&redirect_uri=' . self::APP_CALLBACK;

		return $url;
	}

	public function getLongAccessTokenUrl($token) {

		$url = 	self::ACCESS_TOKEN_HOST .
				'?client_id=' . self::APP_ID .
				'&client_secret=' . self::APP_SECRET .
				'&grant_type=fb_exchange_token' .
				'&fb_exchange_token=' . $token;

		return $url;		
	}

	public function allowAccessToken($code) {

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->getAccessTokenUrl($code));

		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_TIMEOUT, 50);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1");
		
		$response	= curl_exec($ch);
		$errno		= curl_errno($ch);
		$error		= curl_error($ch);
		$info		= curl_getinfo($ch);

		$hash = array();
		if( ($errno == CURLE_OK) && ($info['http_code'] == 200)) {
			parse_str($response, $hash);
		}

		return $hash;

	}

	public function allowLongAccessToken($token) {

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->getLongAccessTokenUrl($token));

		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_TIMEOUT, 50);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1");
	
		$response	= curl_exec($ch);
		$errno		= curl_errno($ch);
		$error		= curl_error($ch);
		$info		= curl_getinfo($ch);
		
		$hash = array();
		if( ($errno == CURLE_OK) && ($info['http_code'] == 200)) {
			parse_str($response, $hash);
		}

		return $hash;

	}

	public function	profile($account,$username= 'me') {

		$args = array();

		if (!empty($account)) {
			$args = array('access_token' => $account['access_token']);
		}

		return $this->facebook->api("/{$username}", $args);
	}

	public function getMasterPagesGraph($account) {

		$master_pages = $this->getMasterPages($account);

		$pages = array();

		if (count($master_pages)) {

			$master_pages = $master_pages['data'];

			foreach ($master_pages as $key => $page) {

				$page_graph = $this->profile(array('access_token'=>$page['access_token']));

				$mixed = array_merge($page_graph,$page);
				$mixed['login'] = $mixed['name'];
				if (isset($mixed['username'])) {
					$mixed['login'] = $mixed['username'];
				}

				if ($page_graph) {
					array_push($pages, $mixed);
				}
			}
		}

		return $pages;
	}


	public function getMasterPages($account) {

		$params = array(
			'access_token' => $account['token'],
		);
		return $this->facebook->api( "/".$account['external_user_id']."/accounts", 'GET', $params );
	}

	protected function processApiParams ( $params ) {
		 
		(!empty($params['limit'])) ? $api_params['limit'] = $params['limit'] : null;
		(!empty($params['since'])) ? $api_params['since'] = $params['since'] : null;
		(!empty($params['fields']))? $api_params['fields']= $params['fields']: null;

		return $api_params;
	}	


	/* COLLECT METHODS */

	public function getFeed($account, $params = array()) {

		$path	= "/{$account['external_user_id']}/feed";

		$args = $this->processApiParams($params);

		(isset($args['method'])) ? $method = $args['method'] : $method = 'GET';

		(!isset($params['access_token'])) ? $args['access_token'] = $account['token'] : null;

		return $this->facebook->api($path, $method, $args);
	}	

	public function stats($account,$username = 'me') {

		$user = $this->profile($account,$username);
		$stats= array();
		if (isset($user['likes'])) {
			$stats['likes'] = $user['likes'];
		}
		return $stats;
	}

	public function getPicture($account,$params = array()) {

		$path	= "/{$account['external_user_id']}/";

		$method = 'GET';

		if (!empty($account['access_token'])) {
			$params['access_token'] = $account['access_token'];
		}

		$params['fields'] = "picture.type(large)";

		return $this->facebook->api($path, $method, $params);		
	}

	public function getPosts($account, $params = array()) {

		$path	= "/{$account['external_user_id']}";

		$args = $this->processApiParams($params);

		(isset($args['method'])) ? $method = $args['method'] : $method = 'GET';

		(!isset($params['access_token'])) ? $args['access_token'] = $account['token'] : null;

		$args['fields'] = 'posts';

		return $this->facebook->api($path, $method, $args);
	}

	public function getPhotos($account, $params = array()) {

		$path	= "/{$account['external_user_id']}/photos/uploaded";

		$args = $this->processApiParams($params);

		(isset($args['method'])) ? $method = $args['method'] : $method = 'GET';

		(!isset($params['access_token'])) ? $args['access_token'] = $account['token'] : null;

		return $this->facebook->api($path, $method, $args);
	}

	public function getVideos($account, $params = array()) {

		$path	= "/{$account['external_user_id']}/videos";

		$args = $this->processApiParams($params);

		(isset($args['method'])) ? $method = $args['method'] : $method = 'GET';

		(!isset($params['access_token'])) ? $args['access_token'] = $account['token'] : null;

		return $this->facebook->api($path, $method, $args);
	}

}