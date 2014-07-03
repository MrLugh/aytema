<?php

App::import('Vendor', 'stdclass', array('file' => 'fb_stdclass.php'));

Class TwitterSocialnet extends AppModel {

	const REQUEST_TOKEN_HOST 	= "https://api.twitter.com/oauth/request_token";
	const ACCESS_TOKEN_HOST		= "https://api.twitter.com/oauth/access_token";
	const AUTHORIZE_TOKEN_HOST 	= "https://api.twitter.com/oauth/authorize";
	const VERIFY_CREDENTIALS	= "https://api.twitter.com/1.1/account/verify_credentials.json";
	const UPDATE_STATUS			= "https://api.twitter.com/1.1/statuses/update.json";
	const STATUS				= "https://api.twitter.com/1.1/statuses";
	const USER_DATA				= 'https://api.twitter.com/1.1/users/show.json';

	//Esto va al config!
	const APP_ID 			= "l9e7aSs4BVet4Oryv7QsGw";
	const APP_SECRET 		= "xnVrbnu7vl4pvgOYjVTNWm3zMuCJNRd1tnhbBMWpio";

	static $content_types	= array('post');

	public function __construct($data = array()) {

		$this->oauth = new OAuth(self::APP_ID, self::APP_SECRET, OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_URI);
	}


	public function getRequestToken() {

		return $this->oauth->getRequestToken(self::REQUEST_TOKEN_HOST);
	}

	public function getAuthorizeUrl($token) {

		return self::AUTHORIZE_TOKEN_HOST . '?oauth_token='.$token;
	}

	public function setToken($token, $secret) {

		$this->oauth->setToken($token, $secret);
	}	

	public function getAccessToken($token, $secret) {

		$this->setToken($token, $secret);
		return $this->oauth->getAccessToken(self::ACCESS_TOKEN_HOST);
	}

	public function verifyCredentials($account, $params = array()) {

		$this->setToken($account['token'], $account['secret']);
  		$this->oauth->fetch(self::VERIFY_CREDENTIALS);
  		$response = $this->oauth->getLastResponseInfo();

  		if($response['http_code'] == 200) {
  			return json_decode($this->oauth->getLastResponse(),true);
  		}
  		
  		return false;
	}

	/* COLLECT METHODS */

	public function stats($account, $params = array()) {

		$user = $this->verifyCredentials($account,$params);
		$stats= array();
		if (isset($user['statuses_count'])) {
			$stats['statuses'] = $user['statuses_count'];
		}
		if (isset($user['followers_count'])) {
			$stats['followers'] = $user['followers_count'];
		}
		if (isset($user['friends_count'])) {
			$stats['friends'] = $user['friends_count'];
		}
		if (isset($user['favourites_count'])) {
			$stats['favourites'] = $user['favourites_count'];
		}
		return $stats;		
	}

	public function getPostEmbed($account,$id) {

		$this->setToken($account['token'], $account['secret']);
		
		$path	= self::STATUS.'/oembed';
	
		$args	= array('id' => $id);

		$this->oauth->fetch($path.'.json', $args, OAUTH_HTTP_METHOD_GET);
		$response = $this->oauth->getLastResponseInfo();

		if($response['http_code'] == 200) {
			return json_decode($this->oauth->getLastResponse());
		}

		return false;

	}

	public function getPosts($account, $params = array()) {

		$this->setToken($account['token'], $account['secret']);
		
		$path	= self::STATUS.'/user_timeline';

		$args	= array();

		$args['screen_name'] = $account['login'];

		(!empty($params['since_id'])) ? $args['since_id'] = sprintf("%s",$params['since_id']) : null;
		(!empty($params['limit']))	  ? $args['count'] 	  = (string)$params['limit'] : $args['count'] = "50";

		// fetch images IMPORTANT!
		$args["include_entities"] = true;

		$this->oauth->fetch($path.'.json', $args, OAUTH_HTTP_METHOD_GET);
		$response = $this->oauth->getLastResponseInfo();
  		
		if($response['http_code'] == 200) {
			//return json_decode($this->oauth->getLastResponse());
			// Get embed
			$posts = json_decode($this->oauth->getLastResponse());
			$posts = Fb_stdclass::object_to_array($posts);
			foreach ($posts as $key => $post) {
				$embed = $this->getPostEmbed($account,$post['id']);
				$embed = Fb_stdclass::object_to_array($embed);
				if (isset($embed['html'])) {
					$posts[$key]['embed'] = $embed['html'];
				}
			}
			return $posts;
		}
  		
		return false;
	}

	/** Public methods **/
	public function validateFollow($account,$username) {
		try {
			$this->setToken($account['token'], $account['secret']);
			
			$path	= self::USER_DATA;
		
			$args	= array('screen_name' => $username);

			$this->oauth->fetch($path, $args, OAUTH_HTTP_METHOD_GET);
			$response = $this->oauth->getLastResponseInfo();

			if($response['http_code'] == 200) {
				$user = json_decode($this->oauth->getLastResponse(),true);
			}			
		} catch (Exception $e) {
			$user = array();
		}
		return $user;
	}

}