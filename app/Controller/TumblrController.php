<?php

App::import('model','Socialnet');
App::import('model','Content');

/* ONLY FOR TEST  */
App::import('Vendor', 'CollectData', array('file' => 'collect_data/collect_data.php'));

class TumblrController extends AppController {

	public static $network = "tumblr";

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
       	$response_data	= array();

		$network 	= self::$network;
		$action 	= isset($this->request->query['action'])		? $this->request->query['action']		: null;
		$token		= isset($this->request->query['oauth_token'])	? $this->request->query['oauth_token']	: null;

		$this->set('network', $network);

		$user_id = $this->Auth->user('id');
		$mo_socialnet = $this->Socialnet->Factory($network);
		
		if ( $action && $action == "start" ) {

			// Delete old pending accounts
			$this->Socialnet->deleteAll(array(
				'Socialnet.user_id'	=> $user_id,
				'Socialnet.network'	=> self::$network,
				'Socialnet.status'	=> "Pending",
				)
			);

			$request_token = $mo_socialnet->getRequestToken();

			if (!$request_token) {
				$msg = $view->element('flash/error', array('message'=>__('There is not a request token')));
				$response_data = array(
					'status'	=> 'error',
					'status_msg'=> $msg,
				);
				$this->set("response_data",$response_data);
				$this->render();
			}

			$socialnet = new Socialnet();
			$socialnet = $socialnet->save(array(
				'user_id'			=> $user_id,
				'network'			=> self::$network,
				'status'			=> 'Pending',
				'token'				=> $request_token['oauth_token'],
				'secret'			=> $request_token['oauth_token_secret'],
				'external_user_id'	=> date('Y-m-d H:i:s'),
				'created'			=> date('Y-m-d H:i:s'),
				)
			);
			
			return $this->redirect($mo_socialnet->getAuthorizeUrl($request_token['oauth_token']));
		}

		if ($token) {

			try {

				$account = $this->Socialnet->find('all', array(
					'conditions' => array(
						'Socialnet.token'	=> $token,
						'Socialnet.user_id'	=> $user_id,
						'Socialnet.network'	=> self::$network,
						'Socialnet.status'	=> "Pending",
						)
					)
				);

				if (!$account) {
					$msg = $view->element('flash/error', array('message'=>__('There is not a pending account for the request token')));
					$response_data = array(
						'status'	=> 'error',
						'status_msg'=> $msg,
					);
					$this->set("response_data",$response_data);
					$this->render();
				}

				$account = array_shift($account);

				$access_token = $mo_socialnet->getAccessToken($token,$account['Socialnet']['secret']);

				if (!$access_token) {
					$msg = $view->element('flash/error', array('message'=>__('There is not access token')));
					$response_data = array(
						'status'	=> 'error',
						'status_msg'=> $msg,
					);
					$this->set("response_data",$response_data);
					$this->render();
				}

				$params = array(
					'token'	=> $access_token['oauth_token'],
					'secret'=> $access_token['oauth_token_secret']
				);
				$network_data = $mo_socialnet->verifyCredentials($params);

				if (!$network_data) {
					$msg = $view->element('flash/error', array('message'=>__('There is not Tumblr information')));
					$response_data = array(
						'status'	=> 'error',
						'status_msg'=> $msg,
					);
					$this->set("response_data",$response_data);
					$this->render();
				}

				$params['external_user_id'] = $network_data['user']['name'];
				$picture_url = $mo_socialnet->getPicture($params);

				$old_account = $this->Socialnet->find('all', array(
					'conditions' => array(
						'Socialnet.user_id'				=> $user_id,
						'Socialnet.network'				=> self::$network,
						'Socialnet.status'				=> 'Allowed',
						'Socialnet.login'				=> $network_data['user']['name'],
						'Socialnet.external_user_id'	=> $network_data['user']['name'],
						)
					)
				);

				if ($old_account) {
					$old_account = array_shift($old_account);
					$this->Socialnet->delete($old_account['Socialnet']['id']);
				}

				$save = array(
					'id'				=> $account['Socialnet']['id'],
					'user_id'			=> $user_id,
					'login'				=> $network_data['user']['name'],
					'network'			=> self::$network,
					'status'			=> 'Allowed',
					'token'				=> $access_token['oauth_token'],
					'secret'			=> $access_token['oauth_token_secret'],
					'external_user_id'	=> $network_data['user']['name'],
					'created'			=> date('Y-m-d H:i:s'),
					'profile_image'		=> $picture_url,
					'stats'				=> json_encode($mo_socialnet->stats($params)),
				);

				if (isset($network_data['user']['blogs']) && count($network_data['user']['blogs'])) {

					foreach ($network_data['user']['blogs'] as $key => $blog) {

						if ($blog['primary']) {
							$save['profile_url'] = $blog['url'];
							break;
						}
					}
				}

				if (!$this->Socialnet->save($save)) {
					$msg = __('There was an error adding the account');
					$status = 'error';
				} else {
					$msg = __('The account was added');
					$status = 'success';					
				}

				$msg = $view->element('flash/'.$status, array('message'=>$msg));
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

			$msg = $view->element('flash/error', array('message'=>__('There is not token')));
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

			$tb_aux = $this->Socialnet->find('all', array(
	   			'conditions' => array(
	   				'Socialnet.network'			=> self::$network,
	   				'Socialnet.status'			=> "Allowed",
	   				'Socialnet.token != '		=> "",
					'Socialnet.secret != '		=> "",
	   			),
				'order'	=> array('Socialnet.id' => 'desc'),
				'limit'	=> 1
				)
			);
			if (empty($tb_aux)) {
				$msg = __('There was an error adding the account');
				$response_data = array(
					'status'	=> 'error',
					'status_msg'=> $msg,
				);
				die(json_encode($response_data));
			}

			$tb_aux = array_shift($tb_aux);
			$params = array(
				'token'	=> $tb_aux['Socialnet']['token'],
				'secret'=> $tb_aux['Socialnet']['secret']
			);

			$network_data = $mo_socialnet->validateFollow($params,$username);

			if (!$network_data) {
				$msg = __('There is not Twitter information');
				$response_data = array(
					'status'	=> 'error',
					'status_msg'=> $msg,
				);
				die(json_encode($response_data));
			}

			$picture_url = $mo_socialnet->getPicture(array(
				'external_user_id'=>$network_data['response']['blog']['name']
			));

			$save = array(
				'user_id'			=> $user_id,
				'login'				=> $network_data['response']['blog']['name'],
				'network'			=> self::$network,
				'status'			=> 'Allowed',
				'token'				=> '',
				'secret'			=> '',
				'external_user_id'	=> $network_data['response']['blog']['name'],
				'created'			=> date('Y-m-d H:i:s'),
				'profile_url'		=> $network_data['response']['blog']['url'],
				'profile_image'		=> $picture_url,
				'stats'				=> json_encode($mo_socialnet->getBlogStats($params,$username)),
			);			

			//Check if already exists an account by $network_data['username'],
			$accounts = $this->Socialnet->find('all', array(
	   			'conditions' => array(
	   				'Socialnet.user_id'			=> $user_id,
	   				'Socialnet.network'			=> self::$network,
	   				'Socialnet.status'			=> "Allowed",
	   				'Socialnet.external_user_id'=> $network_data['response']['blog']['name'],
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
	   					'Socialnet.external_user_id'=> $network_data['response']['blog']['name']
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