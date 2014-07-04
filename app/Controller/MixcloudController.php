<?php

App::import('model','Socialnet');
App::import('model','Content');

/* ONLY FOR TEST  */
App::import('Vendor', 'CollectData', array('file' => 'collect_data/collect_data.php'));

class MixcloudController extends AppController {

	public static $network = "mixcloud";

	public function beforeFilter() {

		$this->modelClass 	= 'Socialnet';
		$this->modelKey 	= 'Socialnet';
		$this->loadModel('Socialnet');
		$this->loadModel('Content');
	}

	public function index() {


	}	

	public function addAccount() {

	}

	public function addFollow() {

		$view = new View($this, false);
		$this->view 	= '/Elements/Socialnets/ajax/add_non_oauth_account';
		$this->layout 	= 'anonymous';
       	$response_data	= array();

		$network 	= self::$network;
		$username	= isset($this->request->query['username'])	? $this->request->query['username']	: null;

		$username = trim($username);
		$user_id = $this->Auth->user('id');
		$mo_socialnet = $this->Socialnet->Factory($network,array("user_id" => $user_id));		

		try {

			$network_data = $mo_socialnet->profile($username);
			if (!$network_data) {
				$msg = $view->element('flash/error', array('message'=>__('There is not MixCloud information')));
				$response_data = array(
					'status'	=> 'error',
					'status_msg'=> $msg,
				);
				die(json_encode($response_data));
			}

			$picture_url = "";
			if (isset($network_data['pictures']['extra_large'])) {
				$picture_url = $network_data['pictures']['extra_large'];
			}

			$msg 	= 'The account was added';

			$save = array(
				'user_id'			=> $user_id,
				'login'				=> $network_data['username'],
				'network'			=> self::$network,
				'status'			=> 'Allowed',
				'token'				=> '',
				'secret'			=> '',
				'external_user_id'	=> $network_data['username'],
				'created'			=> date('Y-m-d H:i:s'),
				'profile_url'		=> $network_data['url'],
				'profile_image'		=> $picture_url,
				'stats'				=> json_encode($mo_socialnet->stats($username)),
			);

			//Check if already exists an account by $network_data['username'],
			$accounts = $this->Socialnet->find('all', array(
       			'conditions' => array(
       				'Socialnet.user_id'			=> $user_id,
       				'Socialnet.network'			=> self::$network,
       				'Socialnet.status'			=> "Allowed",
       				'Socialnet.external_user_id'=> $network_data['username'],
       				)
    			)
    		);

    		if (count($accounts)) {
    			$msg 	= 'You already have synced this account';
    			$account = array_shift($accounts);
    			$save['id'] = $account['Socialnet']['id'];
    		}

	    	$socialnet = new Socialnet();
	    	$socialnet = $socialnet->save($save);

	    	$msg = $view->element('flash/success', array('message'=>__($msg)));
			$response_data = array(
				'status'	=> 'success',
				'status_msg'=> __($msg),
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