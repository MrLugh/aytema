<?php

App::import('Vendor', 'Crawler', array('file' => 'crawler.php'));

Class MixcloudSocialnet {

	const AUTHORIZE_HOST	= "https://www.mixcloud.com/oauth/authorize";
	const ACCESS_TOKEN_HOST	= "https://www.mixcloud.com/oauth/access_token";
	const API_URL			= "http://api.mixcloud.com";

	//Esto va al config!
	const APP_ID 			= "XvjV23U8zawTxMp368";
	const APP_SECRET 		= "YVeSaskkEfsS8NceZjzsjj8QHsUTfbsb";
	const APP_CALLBACK 		= "http://cloudcial.com/mixcloud/addAccount";

	static $content_types	= array('track');

	public function __construct($data = array()) {

	}

	public function getAuthorizeUrl() {

		$url = 	self::AUTHORIZE_HOST .
				'?client_id=' . self::APP_ID .
				'&redirect_uri=' . self::APP_CALLBACK;

		return $url;
	}

	public function getAccessTokenUrl($code) {
		
		$url = 	self::ACCESS_TOKEN_HOST . 
				'?client_id=' . self::APP_ID .
				'&redirect_uri=' . self::APP_CALLBACK .
				'&client_secret=' . self::APP_SECRET .
				'&code=' . $code;

		return $url;	
	}	

	public function allowAccessToken($code) {

		$query = str_replace(self::ACCESS_TOKEN_HOST,'',$this->getAccessTokenUrl($code));
		return $this->callRequest(self::ACCESS_TOKEN_HOST,$query);
	}

	public function callRequest($url,$query = "") {

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url.$query);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_TIMEOUT, 50);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1");
		curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Length: ".strlen($query)));
		curl_setopt($ch, CURLOPT_POSTFIELDS, $query);

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


	/* COLLECT METHODS */


	/* NON OAUTH METHODS */

	public function stats($username) {

		$user = $this->profile($username);
		$stats= array();
		if (isset($user['cloudcast_count'])) {
			$stats['cloudcasts'] = $user['cloudcast_count'];
		}
		if (isset($user['listen_count'])) {
			$stats['listen'] = $user['listen_count'];
		}
		if (isset($user['followers_count'])) {
			$stats['followers'] = $user['followers_count'];
		}
		if (isset($user['follower_count'])) {
			$stats['followers'] = $user['follower_count'];
		}
		if (isset($user['favorite_count'])) {
			$stats['favorites'] = $user['favorite_count'];
		}
		return $stats;
	}

	public function getContent($username,$concept,$id) {

		$url = self::API_URL."/{$username}/{$id}";
		return $this->getEmbed($url);
	}

	public function profile($username) {

		$crawler = new Crawler(self::API_URL."/{$username}/?metadata=1");

		if ($crawler->call_url() && $crawler->get_header_response() == '200') {
			return json_decode($crawler->get_response(), true);
		}
		return false;
	}

	public function getEmbed($url) {

		$url = "http://www.mixcloud.com/oembed/?url=".urlencode($url)."&format=json";
		$crawler = new Crawler($url);

		if ($crawler->call_url() && $crawler->get_header_response() == '200') {
			return json_decode($crawler->get_response(), true);
		}
		return false;
	}	

	public function getTracks($account) {

		$crawler = new Crawler(self::API_URL."/{$account['external_user_id']}/cloudcasts/");

		if ($crawler->call_url() && $crawler->get_header_response() == '200') {
			return json_decode($crawler->get_response(), true);
		}
		return false;
	}

}