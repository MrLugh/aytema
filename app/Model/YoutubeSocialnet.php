<?php

App::import('Vendor', 'Google_Client', array('file' => 'google-api-php-client/Google_Client.php'));
App::import('Vendor', 'Google_Oauth2Service', array('file' => 'google-api-php-client/contrib/Google_Oauth2Service.php'));
App::import('Vendor', 'Crawler', array('file' => 'crawler.php'));

Class YoutubeSocialnet {

	private $client 			= null;
	private $oauth 				= null;	

	const REQUEST_TOKEN_HOST 	= "https://www.google.com/accounts/OAuthGetRequestToken";
	const ACCESS_TOKEN_HOST 	= "https://www.google.com/accounts/OAuthGetAccessToken";
	const AUTHORIZE_TOKEN_HOST 	= "https://www.google.com/accounts/OAuthAuthorizeToken";
	const USER_PROFILE 			= "https://gdata.youtube.com/feeds/api/users/default?v=2";
	const UPDATE_STATUS 		= "";
 	const UPLOADS       		= "https://gdata.youtube.com/feeds/api/users/default/uploads?v=2&alt=json";
 	const PLAYLIST      		= "https://gdata.youtube.com/feeds/api/playlists/PLAYLIST_ID?v=2&alt=json&max-results=50";
 	const KEYWORDS      		= "https://gdata.youtube.com/feeds/api/videos?q=KEYWORDS&v=2&alt=json&max-results=50";	
	const SCOPE	    			= "scope=http://gdata.youtube.com";
	const VIDEO	    			= "http://gdata.youtube.com/feeds/api/videos/VIDEO_ID?v=2&alt=json";
	const TRAFFIC_DETAILS 		= "https://www.googleapis.com/youtube/analytics/v1/reports?";
	const V3_VIDEO_LIST	    	= "https://www.googleapis.com/youtube/v3/videos?";
	const V3_SUBSCRIBE	    	= "https://www.googleapis.com/youtube/v3/subscriptions?";


	//Esto va al config!
	const APP_KEY 			= "AIzaSyDgE0KcEAKdRQl9IReB4E7ZBZpQOL2Cxz8";
	const APP_ID 			= "679197995961-ci1cei1vtn3cpek92u1g7ogg1cmlk790.apps.googleusercontent.com";
	const APP_SECRET 		= "zp9fV3AYAapJtHMjdnv1U1x7";
	const APP_PERMS 		= "https://www.googleapis.com/auth/youtube.readonly,https://www.googleapis.com/auth/youtube,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/yt-analytics.readonly";
	const APP_CALLBACK 		= "http://cloudcial.com/youtube/addAccount";

	static $content_types	= array('video');

	public function googleClient() {

		if (!empty($this->client)) return $this->client;

		$client = new Google_Client();
		$client->setApplicationName("Google UserInfo PHP Starter Application");
		$client->setClientId(self::APP_ID);
		$client->setClientSecret(self::APP_SECRET);
		$client->setRedirectUri(self::APP_CALLBACK);
		$client->setScopes(explode(',',self::APP_PERMS));
		$client->setAccessType('offline');

		$this->client = $client;
		return $this->client;
	}

	public function googleOauth() {

		if (!empty($this->oauth)) return $this->oauth;

		$this->oauth =  new Google_Oauth2Service($this->client);
		return $this->oauth;
	}

	public function setTokenExpire($expiration) {

		$this->token_expire = $expiration;
	}


	public function setRefreshToken($token) {

		$this->refresh_token = $token;
	}

	public function setOauth2Secret($secret) {

		$this->oauth2_secret = $secret;
	}

	public function setExternalUserid($id) {

		$this->external_user_id = $id;
	}

	/**
	 * Execute curl call
	 * 
	 * @todo Change to use mo_crawler like in this->get_profile()
	 * @param string $url
	 * @param array $postfields
	 * @param array $httpheader
	 * @return string|boolean
	 */
	private function response($url, $postfields = array(), $httpheader = array()) {

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_TIMEOUT, 50);
		if (count($postfields)) {curl_setopt($ch, CURLOPT_POSTFIELDS, $postfields);}
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1");
		if (count($httpheader)) {curl_setopt($ch, CURLOPT_HTTPHEADER, $httpheader);}
		
		$response 	= curl_exec($ch);
		$error    	= curl_error($ch);

		if (!strlen($error))
		{
			return json_decode($response,true);
		}
		return false;
	}	

	public function refreshToken() {

		$curl_url 	= "https://accounts.google.com/o/oauth2/token";
		$data = array(
					'client_id'		=> self::APP_ID,
					'client_secret' => self::APP_SECRET,
					'refresh_token' => $this->refresh_token,
					'grant_type' => 'refresh_token',
				);

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $curl_url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_TIMEOUT, 50);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1");
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

		$response = curl_exec($ch);

		return json_decode($response, true);
	}	

	public function refreshAccessToken() {
	
		$response = array(
			'status' => 'success',
		);

		if(isset($this->oauth2_secret) && isset($this->external_user_id))
		{
			if(time() > strtotime($this->token_expire))
			{
				$new_token = $this->refreshToken();

				if(isset($new_token['access_token']))
				{
					$this->oauth2_secret 	= $new_token['access_token'];
					$this->token_expire 	= $new_token['expires_in'];

					$response['data']	= array(
						'secret'	=> $new_token['access_token'],
						'expiration'=> date("Y-m-d H:i:s", time() + $new_token['expires_in'])
					);
					return $response;
				}
				else
				{
					$response['status'] = 'error';
					return $response;
				}
			}
			else
			{
				$response['status'] = 'success';
				return $response;
			}
		}  		
		$response['status'] = 'error';
		return $response;
	}


	public function getProfile() {

		$httpheader = array(
			"Authorization:  Bearer {$this->oauth2_secret}",
			"Content-Type:  application/json"
		);

		$crawler = new Crawler(self::USER_PROFILE . '&alt=json');

		$crawler->set_opt(CURLOPT_HTTPHEADER, $httpheader);
		$crawler->set_opt(CURLOPT_TIMEOUT, 50);

		if ($crawler->call_url())
		{
			$response = $crawler->get_response();

			if ($crawler->get_header_response() != 200)
			{
				throw new YouTube_API_Exception($this->parseYoutubeError($crawler->get_response_headers('STATUS')));
			}

			return json_decode($response, true);
		}
	}

	private static function parseYoutubeError($string) {

		$matches = array();
		// HTTP/1.1 401 NoLinkedYouTubeAccount
		if (preg_match("/(\S+)$/", $string, $matches))
		{
			return $matches[1];
		}

		return false;
	}


	/* COLLECT METHODS */

	public function getVideos($account, $params = array()) {

		$this->setOauth2Secret($account['token']);
		$this->setRefreshToken($account['refresh_token']);
		$this->setTokenExpire($account['expiration']);
		$this->setExternalUserId($account['external_user_id']);

		(empty($params['user']) || $params['user'] == 'me' )	? $user = 'default' : $user=$params['user'];		

		$path = str_replace('default',$user,self::UPLOADS);

		foreach ($params as $key => $value) {
			$path.= "&{$key}={$value}";
		}

		$path.="&access_token=".$account['token'];

		$httpheader = array(
			"Authorization:  Bearer {$this->oauth2_secret}",
			"Content-Type:  application/json"
		);

		$data = $this->refreshAccessToken();

		if($data)
		{
			return $this->response($path, array() , $httpheader);
		}

		return false;
	}

	public function getAllVideos($account, $params = array()) {

		(empty($params['user']) || $params['user'] == 'me' )	? $user = 'default' : $user=$params['user'];

		$i 		= 0;
		$videos = array();

		(isset($params['max-results'])) ? $items_per_page = $params['max-results'] : $items_per_page = '50';

		$api_params 				= array();
		$api_params['start-index'] 	= 1;
		$api_params['max-results'] 	= $items_per_page;

		$feed = $this->getVideos($account,$api_params);

		while (isset($feed['feed']['entry'])) {
			
			if ( !is_numeric(array_shift(array_keys($feed['feed']['entry']))) ) {
				$videos = array_merge($videos,array(0=>$feed['feed']['entry']));
			} else {
				$videos = array_merge($videos,$feed['feed']['entry']);
			}

			$i++;			
			$api_params['start-index'] = ($i * $items_per_page) + 1;
			$feed = $this->getVideos($account,$api_params);
		}

		return $videos;
	}	

}

class YouTube_API_Exception extends Exception{

	protected $message = 'YouTube_API_Exception';
	protected $code;

	public function __construct($message = '', $code = 0, Exception $previous = null) {

		$message	= (!strlen($message)) ? $this->message : $message;
		$code		= (is_null($code)) ? $this->code : $code;

		parent::__construct($message, $code, $previous);
	}

}