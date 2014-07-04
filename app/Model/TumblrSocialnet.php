<?php

Class TumblrSocialnet {

	const REQUEST_TOKEN_HOST 	= "http://www.tumblr.com/oauth/request_token";
	const ACCESS_TOKEN_HOST		= "http://www.tumblr.com/oauth/access_token";
	const AUTHORIZE_TOKEN_HOST 	= "http://www.tumblr.com/oauth/authorize";

	const VERIFY_CREDENTIALS	= "http://api.tumblr.com/v2/user/info";
	const UPDATE_STATUS			= "http://tumblr.com/statuses/update.json";
	const RETRIEVE_DATA			= "http://api.tumblr.com/v2/blog";
	const USER_DATA				= "http://api.tumblr.com/v2/blog/*.tumblr.com/info";

	//Esto va al config!
	const APP_ID 			= "TyJKAYXQm61AsADJ8vpgGLoPcwxpme8LzWaOfRvYGLJeRQ31Az";
	const APP_SECRET 		= "hYkvNmO4UqMMq2lvja7OdoDJsQJEm4VNrpmszt6A9O1hnAzWr4";
	const APP_CALLBACK 		= "http://cloudcial.com/tumblr/addAccount";

	static $content_types	= array('photo','track','video','quote'/*,'post','link','chat'*/);


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
  		
  		if (isset($response['http_code']) && $response['http_code'] == 200) {
  			$data =  json_decode($this->oauth->getLastResponse(),true);
  			return $data['response'];
  		}
  		
  		return false;
	}

	public function getPicture($account, $params = array()) {

		return self::RETRIEVE_DATA . "/{$account['external_user_id']}.tumblr.com/avatar/512";
	}


	/* COLLECT METHODS */

	public function stats($account, $params = array()) {

		$user = $this->verifyCredentials($account,$params);
		$stats= array();
		if (isset($user['user']['likes'])) {
			$stats['likes'] = $user['user']['likes'];
		}
		if (isset($user['user']['blogs'])) {
			$stats['blogs'] = count($user['user']['blogs']);
		}		
		if (isset($user['user']['following'])) {
			$stats['following'] = $user['user']['following'];
		}
		if (isset($user['user']['blogs']) && count($user['user']['blogs'])) {

			foreach ($user['user']['blogs'] as $key => $blog) {

				if ($blog['primary']) {
					$stats['followers'] = $blog['followers'];
					$stats['posts']		= $blog['posts'];
					break;
				}
			}
		}
		return $stats;
	}	

	public function getPhotos($account, $params = array()) {

		$this->setToken($account['token'], $account['secret']);

		$path = self::RETRIEVE_DATA . "/{$account['external_user_id']}.tumblr.com/posts/photo";
		$path.= "?api_key=".self::APP_ID;

		(isset($params['method'])) ? $method = $params['method'] : $method = 'GET';

		(isset($params['offset'])) ? $path .= '&offset='.$params['offset'] : '';
		(isset($params['before_id'])) ? $path .= '&before_id='.$params['before_id'] : '';

		$this->oauth->fetch($path, null, OAUTH_HTTP_METHOD_GET);
		$response = $this->oauth->getLastResponseInfo();

		if($response['http_code'] == 200) {
			return json_decode($this->oauth->getLastResponse(),true);
		}
  		
		return false;
	}

	public function getQuotes($account, $params = array()) {

		$this->setToken($account['token'], $account['secret']);

		$path = self::RETRIEVE_DATA . "/{$account['external_user_id']}.tumblr.com/posts/quote";
		$path.= "?api_key=".self::APP_ID;

		(isset($params['method'])) ? $method = $params['method'] : $method = 'GET';

		(isset($params['offset'])) ? $path .= '&offset='.$params['offset'] : '';		
		
		$this->oauth->fetch($path, null, OAUTH_HTTP_METHOD_GET);
		$response = $this->oauth->getLastResponseInfo();

		if($response['http_code'] == 200) {
			return json_decode($this->oauth->getLastResponse(),true);
		}
  		
		return false;
	}

	public function getTracks($account, $params = array()) {

		$this->setToken($account['token'], $account['secret']);

		$path = self::RETRIEVE_DATA . "/{$account['external_user_id']}.tumblr.com/posts/audio";
		$path.= "?api_key=".self::APP_ID;

		(isset($params['method'])) ? $method = $params['method'] : $method = 'GET';

		(isset($params['offset'])) ? $path .= '&offset='.$params['offset'] : '';		
		
		$this->oauth->fetch($path, null, OAUTH_HTTP_METHOD_GET);
		$response = $this->oauth->getLastResponseInfo();

		if($response['http_code'] == 200) {
			return json_decode($this->oauth->getLastResponse(),true);
		}
  		
		return false;
	}

	public function getPosts($account, $params = array()) {

		$this->setToken($account['token'], $account['secret']);

		$path = self::RETRIEVE_DATA . "/{$account['external_user_id']}.tumblr.com/posts/text";
		$path.= "?api_key=".self::APP_ID;

		(isset($params['method'])) ? $method = $params['method'] : $method = 'GET';

		(isset($params['offset'])) ? $path .= '&offset='.$params['offset'] : '';		
		
		$this->oauth->fetch($path, null, OAUTH_HTTP_METHOD_GET);
		$response = $this->oauth->getLastResponseInfo();

		if($response['http_code'] == 200) {
			return json_decode($this->oauth->getLastResponse(),true);
		}
  		
		return false;
	}

	public function getVideos($account, $params = array()) {

		$this->setToken($account['token'], $account['secret']);

		$path = self::RETRIEVE_DATA . "/{$account['external_user_id']}.tumblr.com/posts/video";
		$path.= "?api_key=".self::APP_ID;

		(isset($params['method'])) ? $method = $params['method'] : $method = 'GET';

		(isset($params['offset'])) ? $path .= '&offset='.$params['offset'] : '';
		
		$this->oauth->fetch($path, null, OAUTH_HTTP_METHOD_GET);
		$response = $this->oauth->getLastResponseInfo();

		if($response['http_code'] == 200) {
			return json_decode($this->oauth->getLastResponse(),true);
		}
  		
		return false;
	}

	public function getLinks($account, $params = array()) {

		$this->setToken($account['token'], $account['secret']);

		$path = self::RETRIEVE_DATA . "/{$account['external_user_id']}.tumblr.com/posts/link";
		$path.= "?api_key=".self::APP_ID;

		(isset($params['method'])) ? $method = $params['method'] : $method = 'GET';

		(isset($params['offset'])) ? $path .= '&offset='.$params['offset'] : '';
		
		$this->oauth->fetch($path, null, OAUTH_HTTP_METHOD_GET);
		$response = $this->oauth->getLastResponseInfo();

		if($response['http_code'] == 200) {
			return json_decode($this->oauth->getLastResponse(),true);
		}
  		
		return false;
	}

	public function getChats($account, $params = array()) {

		$this->setToken($account['token'], $account['secret']);

		$path = self::RETRIEVE_DATA . "/{$account['external_user_id']}.tumblr.com/posts/chat";
		$path.= "?api_key=".self::APP_ID;

		(isset($params['method'])) ? $method = $params['method'] : $method = 'GET';

		(isset($params['offset'])) ? $path .= '&offset='.$params['offset'] : '';
		
		$this->oauth->fetch($path, null, OAUTH_HTTP_METHOD_GET);
		$response = $this->oauth->getLastResponseInfo();

		if($response['http_code'] == 200) {
			return json_decode($this->oauth->getLastResponse(),true);
		}
  		
		return false;
	}

	/** Public methods **/
	public function validateFollow($account,$username) {
		try {
			$this->setToken($account['token'], $account['secret']);
			
			$path	= str_replace("*",$username,self::USER_DATA);
		
			$args	= array('api_key' => self::APP_ID);

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

	public function getBlogStats($account,$username) {
		$user = $this->validateFollow($account,$username);
		$stats= array();
		if (isset($user['response']['blog']['posts'])) {
			$stats['posts'] = $user['response']['blog']['posts'];
		}
		if (isset($user['response']['blog']['likes'])) {
			$stats['likes'] = $user['response']['blog']['likes'];
		}
		if (isset($user['response']['blog']['followers'])) {
			$stats['followers'] = $user['response']['blog']['followers'];
		}		

		return $stats;
	}

}