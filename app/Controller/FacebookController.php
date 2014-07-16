<?php

App::import('model','Socialnet');
App::import('model','Content');


/* ONLY FOR TEST  */
App::import('Vendor', 'CollectData', array('file' => 'collect_data/collect_data.php'));

class FacebookController extends AppController {

	public static $network = "facebook";

	public function beforeFilter() {

		$this->modelClass 	= 'Socialnet';
		$this->modelKey 	= 'Socialnet';
		$this->loadModel('Socialnet');
		$this->loadModel('Content');

		//ONLY FOR TESTING
		$this->Auth->allow('collect');
	}

	public function index() {


	}

	public function addAccount() {

		$view = new View($this, false);
		$this->view 	= '/Elements/Socialnets/ajax/add_account';
		$this->layout 	= 'anonymous';
       	$response_data	= array();

		$network 	= self::$network;
		$action 	= isset($this->request->query['action'])	? $this->request->query['action']	: null;
		$code		= isset($this->request->query['code'])		? $this->request->query['code']		: null;

		$this->set('network', $network);

		$user_id = $this->Auth->user('id');
		$mo_socialnet = $this->Socialnet->Factory($network);
		
		if ( $action && $action == "start" ) {
			return $this->redirect($mo_socialnet->getAuthorizeUrl());
		} else if ($code) {

			try {

				$token_data = $mo_socialnet->allowAccessToken($code);
				if (!isset($token_data['access_token'])) {
					$msg = $view->element('flash/error', array('message'=>__('There is not access token')));
					$response_data = array(
						'status'	=> 'error',
						'status_msg'=> $msg,
					);
					$this->set("response_data",$response_data);
					$this->render();
				}

				$new_token_data	= $mo_socialnet->allowLongAccessToken($token_data['access_token']);
				if (!isset($new_token_data['access_token'])) {
					$msg = $view->element('flash/error', array('message'=>__('There is not access token')));
					$response_data = array(
						'status'	=> 'error',
						'status_msg'=> $msg,
					);
					$this->set("response_data",$response_data);
					$this->render();
				}

				$params = array('access_token' => $new_token_data['access_token']);
				$network_data = $mo_socialnet->profile($params);

				if (!$network_data) {
					$msg = $view->element('flash/error', array('message'=>__('There is not FaceBook information')));
					$response_data = array(
						'status'	=> 'error',
						'status_msg'=> $msg,
					);
					$this->set("response_data",$response_data);
					$this->render();
				}

				$picture_data = $mo_socialnet->getPicture(array(
					'access_token' 		=> $new_token_data['access_token'],
					'external_user_id'	=> $network_data['id']
					)
				);

				$picture_url = "";
				if (isset($picture_data['picture']['data']['url'])) {
					$picture_url = $picture_data['picture']['data']['url'];
				}

				$msg 	= 'The account was added';

				$save = array(
					'user_id'			=> $user_id,
					'login'				=> $network_data['username'],
					'network'			=> self::$network,
					'status'			=> 'Allowed',
					'token'				=> $new_token_data['access_token'],
					'secret'			=> '',
					'external_user_id'	=> $network_data['id'],
					'created'			=> date('Y-m-d H:i:s'),
					'profile_url'		=> $network_data['link'],
					'profile_image'		=> $picture_url,
					'stats'				=> json_encode($mo_socialnet->stats($params)),
				);

				//Check if already exists an account by $network_data['username'],
				$accounts = $this->Socialnet->find('all', array(
	       			'conditions' => array(
	       				'Socialnet.user_id'			=> $user_id,
	       				'Socialnet.network'			=> self::$network,
	       				'Socialnet.status'			=> "Allowed",
	       				'Socialnet.external_user_id'=> $network_data['id'],
	       				)
	    			)
	    		);

	    		if (count($accounts)) {
	    			$msg 	= 'You already have synced this account';
	    			$account = array_shift($accounts);
	    			$save['id'] = $account['Socialnet']['id'];

	    		} else {
					
					$account = $this->Socialnet->find('all', array(
		       			'conditions' => array(
		       				'Socialnet.token'	=> $new_token_data['access_token'],
		       				'Socialnet.user_id'	=> $user_id,
		       				'Socialnet.network'	=> self::$network,
		       				)
		    			)
		    		);

		    		if (count($account)) {
		    			$msg 	= 'You already have synced this account';
	    				$account = array_shift($accounts);
	    				$save['id'] = $account['Socialnet']['id'];
	    			}
	    		}

		    	$socialnet = new Socialnet();
		    	$socialnet = $socialnet->save($save);

		    	$this->redirect("/facebook/addFanPages");

		    	/*
		    	$msg = $view->element('flash/success', array('message'=>__($msg)));
				$response_data = array(
					'status'	=> 'success',
					'status_msg'=> __($msg),
					'facebook'	=> true,
				);
				$this->set("response_data",$response_data);
				$this->render();
				*/

			} catch (Exception $e) {

		    	$msg = $view->element('flash/success', array('message'=>__('There is an error adding the account')));
				$response_data = array(
					'status'	=> 'success',
					'status_msg'=> $msg,
				);
				$this->set("response_data",$response_data);
				$this->render();

			}

		} else {

			$msg = $view->element('flash/error', array('message'=>__('Missing code param')));
			$response_data = array(
				'status'	=> 'error',
				'status_msg'=> $msg,
			);
			$this->set("response_data",$response_data);
			$this->render();
		}	
	}

	public function addFanPages() {

		$view = new View($this, false);
		$this->view 	= '/Elements/Socialnets/show_fan_pages';
		//$this->layout 	= 'login';

		$user_id = $this->Auth->user('id');

		$conditions = array(
       		'Socialnet.user_id'			=> $user_id,
       		'Socialnet.network'			=> self::$network,
       		'Socialnet.type'			=> '',
       		'Socialnet.token != '		=> ''
       	);

		$masters 		= $this->Socialnet->find('all', array('conditions' => $conditions));
		$master_pages	= array();
		$pages 			= array();

		$conditions = array(
	    	'Socialnet.user_id'			=> $user_id,
	       	'Socialnet.network'			=> self::$network,
	       	'Socialnet.type'			=> 'page',
	       	'Socialnet.status'			=> 'Allowed',
	    );
		$user_pages = $this->Socialnet->find('all', array('conditions' => $conditions));

		if (count($masters)) {

			foreach ($masters as $key => $master_account) {

				$mo_socialnet = $this->Socialnet->factory(self::$network,array("user_id" => $user_id));
				$account_pages = $mo_socialnet->getMasterPagesGraph($master_account['Socialnet']);

				if ($account_pages && count($account_pages)) {
					
					foreach ($account_pages as $key_account_page => $account_page) {

						if (count($master_pages)) {

							foreach ($master_pages as $key_master_page => $master_page) {
								
								if ($master_page['id'] == $account_page['id']) {
									unset($account_pages[$key_account_page]);
									break;
								}
								
							}
						}
					}
				}

				if ($account_pages && count($account_pages)) {
					$master_pages = array_merge($master_pages,$account_pages);
				}

			}

		}

		if (isset($this->request->query['pages'])) {

			$this->view = '/Elements/Socialnets/add_fan_pages';

			foreach ($this->request->query['pages'] as $key => $page_id) {
				
				foreach ($master_pages as $number => $page) {

					if ($page["id"] == $page_id) {

						$picture_data = $mo_socialnet->getPicture(array(
							'access_token' 		=> $page['access_token'],
							'external_user_id'	=> $page['id']
							)
						);

						if (!$picture_data) {
							$picture_url = "";
						} else {
							$picture_url = $picture_data['picture']['data']['url'];
						}

						$stats = array();
						if (isset($page['likes'])) {
							$stats['likes'] = $page['likes'];
						}

						$save = array(
		    				'user_id'			=> $user_id,
	    					'login'				=> $page['login'],
	    					'network'			=> self::$network,
	    					'status'			=> 'Allowed',
	    					'token'				=> $page['access_token'],
	    					'secret'			=> '',
	    					'external_user_id'	=> $page['id'],
	    					'created'			=> date('Y-m-d H:i:s'),
	    					'type'				=> 'page',
	    					'profile_url'		=> "https://www.facebook.com/".$page['id'],
	    					'profile_image'		=> $picture_url,
	    					'stats'				=> json_encode($stats),
	    				);

						if (count($user_pages)) {

							foreach ($user_pages as $key_user_page => $user_page) {
								
								if ($user_page['Socialnet']['external_user_id'] == $page['id']) {
									$save['id'] = $user_page['Socialnet']['id'];
									break;
								}
								
							}

						}

						$socialnet = new Socialnet();
	    				$socialnet = $socialnet->save($save);
	    			}
				}
			}

			$msg = $view->element('flash/success', array('message'=>__('Fan pages were added')));
			$response_data = array(
				'status'	=> 'success',
				'status_msg'=> $msg,
			);
			$this->set("response_data",$response_data);
			$this->render();
		}		

		if (!count($master_pages)) {
			$msg = $view->element('flash/success', array('message'=>__('There are not some new page')));
			$response_data = array(
				'status'	=> 'success',
				'status_msg'=> $msg,
			);
			$this->set("response_data",$response_data);
			$this->render();
		}

		$this->set("fan_pages",$master_pages);
	}

	public function addFollow() {

       	$response_data	= array();

		$network 	= self::$network;
		$username	= isset($this->request->query['username'])	? $this->request->query['username']	: null;

		$username = trim($username);

		$this->set('network', $network);

		$user_id = $this->Auth->user('id');
		$mo_socialnet = $this->Socialnet->Factory($network,array("user_id" => $user_id));

		try {

			$network_data = $mo_socialnet->profile(array(),$username);
			echo '<pre>';var_dump($network_data);echo '</pre>';

			if (!$network_data) {
				$response_data = array(
					'status'	=> 'error',
					'status_msg'=> __('There is not users for your search'),
				);
				die(json_encode($response_data));
			}

			$picture_data = $mo_socialnet->getPicture(array(
				'external_user_id'	=> $network_data['id']
				)
			);

			$picture_url = "";
			if (isset($picture_data['picture']['data']['url'])) {
				$picture_url = $picture_data['picture']['data']['url'];
			}

			$msg 	= __('The account was added');

			$save = array(
				'user_id'			=> $user_id,
				'login'				=> $network_data['username'],
				'network'			=> self::$network,
				'status'			=> 'Allowed',
				'token'				=> '',
				'secret'			=> '',
				'external_user_id'	=> $network_data['id'],
				'created'			=> date('Y-m-d H:i:s'),
				'profile_url'		=> $network_data['link'],
				'profile_image'		=> $picture_url,
				'stats'				=> json_encode($mo_socialnet->stats(array(),$username)),
			);

			//Check if already exists an account by $network_data['username'],
			$accounts = $this->Socialnet->find('all', array(
	   			'conditions' => array(
	   				'Socialnet.user_id'			=> $user_id,
	   				'Socialnet.network'			=> self::$network,
	   				'Socialnet.status'			=> "Allowed",
	   				'Socialnet.external_user_id'=> $network_data['id'],
	   				)
				)
			);

			if (count($accounts)) {
				$msg = __('You already have synced this account');
				$account = array_shift($accounts);
				$save['id'] = $account['Socialnet']['id'];
			} else {
				
				$account = $this->Socialnet->find('all', array(
	       			'conditions' => array(
	       				'Socialnet.user_id'	=> $user_id,
	       				'Socialnet.network'	=> self::$network,
	       				'Socialnet.external_user_id'=> $network_data['id'],
	       				)
	    			)
	    		);

	    		if (count($account)) {
	    			$msg = __('You already have synced this account');
					$account = array_shift($accounts);
					$save['id'] = $account['Socialnet']['id'];
				}
			}

			if (!$this->Socialnet->save($save)) {
				$msg = __('There was an error adding the account');
				$status = 'error';
			} else {
				$msg = __('The account was added');
				$status = 'success';					
			}

			$response_data = array(
				'status'	=> $status,
				'status_msg'=> $msg,
			);
			die(json_encode($response_data));

		} catch (Exception $e) {

			$msg = __('There was an error adding the account');
			$response_data = array(
				'status'	=> 'error',
				'status_msg'=> $msg,
			);
			die(json_encode($response_data));
		}
	}

}