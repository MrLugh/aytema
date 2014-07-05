<?php

App::import('model','Socialnet');
App::import('model','Content');

/* ONLY FOR TEST  */
App::import('Vendor', 'CollectData', array('file' => 'collect_data/collect_data.php'));

class SoundcloudController extends AppController {

	public static $network = "soundcloud";

	public function beforeFilter() {

		$this->modelClass 	= 'Socialnet';
		$this->modelKey 	= 'Socialnet';
		$this->loadModel('Socialnet');
		$this->loadModel('Content');
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

				$network_data = $mo_socialnet->profile($token_data['access_token']);

				if (!$network_data) {
					$msg = $view->element('flash/error', array('message'=>__('There is not SoundCloud me information')));
					$response_data = array(
						'status'	=> 'error',
						'status_msg'=> $msg,
					);
					$this->set("response_data",$response_data);
					$this->render();
				}

				$picture_url = "";
				if (isset($network_data['avatar_url'])) {
					$picture_url = str_replace('-large','-t200x200',$network_data['avatar_url']);
				}
			
				$msg 	= 'The account was added';

				$save = array(
					'user_id'			=> $user_id,
					'login'				=> $network_data['username'],
					'network'			=> self::$network,
					'status'			=> 'Allowed',
					'token'				=> $token_data['access_token'],
					'secret'			=> '',
					'external_user_id'	=> $network_data['id'],
					'created'			=> date('Y-m-d H:i:s'),
					'profile_url'		=> $network_data['permalink_url'],
					'profile_image'		=> $picture_url,
					'stats'				=> json_encode($mo_socialnet->stats($token_data['access_token'])),
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
	    			$msg = $view->element('flash/success', array('message'=>__('You already have synced this account')));
	    			$account = array_shift($accounts);
	    			$save['id'] = $account['Socialnet']['id'];

	    		} else {
					
					$account = $this->Socialnet->find('all', array(
		       			'conditions' => array(
		       				'Socialnet.token'	=> $token_data['access_token'],
		       				'Socialnet.user_id'	=> $user_id,
		       				'Socialnet.network'	=> self::$network,
		       				)
		    			)
		    		);

		    		if (count($account)) {
		    			$msg = $view->element('flash/success', array('message'=>__('You already have synced this account')));
	    				$account = array_shift($accounts);
	    				$save['id'] = $account['Socialnet']['id'];
	    			}
	    		}

				if (!$this->Socialnet->save($save)) {
					$msg = $view->element('flash/error', array('message'=>__('There was an error adding the account')));
					$status = 'error';
				} else {
					$msg = $view->element('flash/success', array('message'=>__('The account was added')));
					$status = 'success';					
				}

				$response_data = array(
					'status'	=> $status,
					'status_msg'=> $msg,
				);
				$this->set("response_data",$response_data);
				$this->render();				

			} catch (Exception $e) {

				$msg = $view->element('flash/error', array('message'=>__('There was an error adding the account')));
				$response_data = array(
					'status'	=> 'error',
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

	public function addFollow() {

       	$response_data	= array();

		$network 	= self::$network;
		$username	= isset($this->request->query['username'])	? $this->request->query['username']	: null;

		$username = trim($username);

		$this->set('network', $network);

		$user_id = $this->Auth->user('id');
		$mo_socialnet = $this->Socialnet->Factory($network,array("user_id" => $user_id));

		try {

			$network_data = $mo_socialnet->validateFollow($username);

			if (!$network_data) {
				$response_data = array(
					'status'	=> 'error',
					'status_msg'=> __('There is not users for your search'),
				);
				die(json_encode($response_data));
			}

			$picture_url = "";
			if (isset($network_data['avatar_url'])) {
				$picture_url = str_replace('-large','-t200x200',$network_data['avatar_url']);
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
				'profile_url'		=> $network_data['permalink_url'],
				'profile_image'		=> $picture_url,
				'stats'				=> json_encode($mo_socialnet->stats("",$username)),
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