<?php

/*
$base = dirname(dirname(__FILE__));
require_once $base . '/lib/class.loader.php';
require_once $base . '/lib/others/html2text/class.html2text.php';
require_once $base . '/app/ds/content_hub/ds_content_hub_abstract.php';
*/

App::import('model','Socialnet');
App::import('Vendor', 'abstract', array('file' => 'collect_data/ds/content_hub/abstract.php'));	

class CollectData {

	private $process_network	= 'all';
	private $args 				= null;
	private $limit 				= 100;
	private $last_id 			= null;
	private $user_id 			= null;
	private $account_id 		= null;
	private $use_last_id 		= true;	
	private $cache_last_id_key 	= null;
	private $cache_control_key 	= null;
	private $networks 			= array();

	private $aux_accounts 		= array();

	public function __construct($params) {

		$this->set_networks(Socialnet::$networks);
		$this->_process_arguments($params);
	}

	public function set_networks($networks = array()) {

		$this->networks = $networks;
	}

	private function _process_arguments($args)	{

		foreach ($args as $name=>$arg)
		{

			if ($name == "network")
			{
				$value = $arg;

				if (isset($this->networks[$value]))
				{
					$this->process_network = $value;
				}
				elseif ($value == 'all')
				{
				}
				else
				{
					throw new Exception('Invalid network');
				}

			}

			elseif ($name == "user_id")
			{
				$value = $arg;

				if ($value > 0)
				{
					$this->user_id = (int) $value;
				}
				else
				{
					throw new Exception('Invalid user id');
				}

			}			
			
			elseif ($name == "account_id")
			{
				$value = $arg;

				if ($value > 0)
				{
					$this->account_id = (int) $value;
				}
				else
				{
					throw new Exception('Invalid account id');
				}

			}

			elseif ($name == "last_id")
			{
				$value = $arg;

				if ($value > 0)
				{
					$this->last_id = (int) $value;
				}
				else
				{
					throw new Exception('Invalid last id');
				}

			}			

			elseif ($name == "limit")
			{
				$value = $arg;

				if ($value > 0)
				{
					$this->limit = (int) $value;
				}
				else
				{
					throw new Exception('Invalid limit');
				}

			}			

			elseif ($name == "cache_key")
			{
				$value = $arg;

				if ($value)
				{
					$this->cache_control_key = $value;
				}
				else
				{
					throw new Exception('Invalid control cache key');
				}

			}

			elseif ($name == "priority")
			{
				$value = $arg;

				if ($value)
				{
					$this->priority = $value;
				}
				else
				{
					throw new Exception('Invalid priority');
				}

			}			

			elseif ($name == "help")
			{
				$this->usage();

				exit(0);
			}

			else
			{
				throw new Exception('Invalid argument ' . $arg);
			}

		}
		$this->args = $args;
	}

	public function set_use_last_id($bool = true) {

		$this->use_last_id = $bool;
	}

	private function check_use_last_id() {

		return $this->use_last_id;
	}

	public function set_cache_control_key($key = null) {

		if (!is_null($key)) {

			$this->cache_control_key = $key;
		}
	}

	private function get_cache_control_key() {

		return $this->cache_control_key;
	}

	private function get_cache_last_id_key()	{

		if (!isset($this->cache_last_id_key))
		{
			$params = $this->args;
			sort($params);
			$this->cache_last_id_key = 'fb_content_hub_last_id-' . trim(preg_replace("/---/", '-', str_replace('=', ':', implode('-', $params))), '-');
		}
		return $this->cache_last_id_key;
	}

	public function accountWithToken($network) {

		if (isset($this->aux_accounts[$network])) {
			return $this->aux_accounts[$network];
		}

		$where 	= array(
			'Socialnet.network'	=> $network,
			'Socialnet.status'	=> 'Allowed',
			'Socialnet.token !='=> '',
		);

		$params = array(
			'conditions'	=> $where,
			'limit'			=> 1,
			'order'			=> 'Socialnet.id DESC',
		);

		$socialnet = new Socialnet();
		$aux_account = $socialnet->find('all', $params);
		if (empty($aux_account)) {
			return array();
		}

		$aux_account = array_shift($aux_account);
		$aux_account = $aux_account['Socialnet'];

		$this->aux_accounts[$network] = $aux_account;

		return $aux_account;

	}

	public function accounts() {

		$where 	= array(
			'Socialnet.status' => 'Allowed',
		);

		if (isset($this->process_network) && $this->process_network != 'all' ) {
			$where['Socialnet.network'] = $this->process_network;
		}

		if (isset($this->user_id)) {
			$where['Socialnet.user_id'] = $this->user_id;
		}

		if (isset($this->last_id)) {
			$where['Socialnet.id >'] = $this->last_id;
		}

		if (isset($this->account_id)) {
			$where['Socialnet.id'] = $this->account_id;
		}

		$params = array(
			'conditions'	=> $where,
			'limit'			=> $this->limit,
			'order'			=> 'Socialnet.id DESC',
		);

		$socialnet = new Socialnet();
		return $socialnet->find('all', $params);

	}

	public function collect() {

		$data = array();

		$accounts = $this->accounts();

		if (!count($accounts))
		{
			//$cache->setKey($this->get_cache_last_id_key())->delete();
			return;
		}

		if ($this->get_cache_control_key()) {
			//$cache->setKey($this->get_cache_control_key())->set(count($accounts));
		}

		foreach ($accounts as $account)
		{

			$account = $account['Socialnet'];

			if ($account['network'] == 'cloudcial') {
				continue;
			}

			if (empty($account['token'])) {
				$aux_account = $this->accountWithToken($account['network']);

				if (empty($aux_account)) {
					continue;
				}

				// Using a valid token and secret!
				$account['token']	= $aux_account['token'];
				$account['secret']	= $aux_account['secret'];

			}

			$account_data = $this->fetch_data($account);

			if (count($account_data)) {
				$data = array_merge($data,$account_data);
			}

		}

		return $data;

	}

	public static function fetch_data($account) {

		$mo_socialnet	= SocialNet::factory($account['network']);
		$ds_hub			= AbstractContentHubDs::factory($account['network']);

		$data = $ds_hub->fetch($account);

		return $data;
	}

}
