<?php

App::import('model','Socialnet');
App::import('model','Content');

/* ONLY FOR TEST  */
App::import('Vendor', 'CollectData', array('file' => 'collect_data/collect_data.php'));

class VimeoController extends AppController {

	public static $network = "vimeo";

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
       	$response_data	= array();

		$network 	= self::$network;
		$action 	= isset($this->request->query['action'])		? $this->request->query['action']			: null;
		$token		= isset($this->request->query['oauth_token'])	? $this->request->query['oauth_token']		: null;
		$verifier	= isset($this->request->query['oauth_verifier'])? $this->request->query['oauth_verifier']	: null;

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

			$_SESSION['oauth_request_token']		= $request_token['oauth_token'];
			$_SESSION['oauth_request_token_secret']	= $request_token['oauth_token_secret'];
			$_SESSION['vimeo_state']				= 'start';

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
				$access_token = $mo_socialnet->getAccessToken($token,$verifier,$account['Socialnet']['secret']);

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
					$msg = $view->element('flash/error', array('message'=>__('There is not Vimeo information')));
					$response_data = array(
						'status'	=> 'error',
						'status_msg'=> $msg,
					);
					$this->set("response_data",$response_data);
					$this->render();
				}

				$picture_url = "";
				if (isset($network_data['person']['portraits']['portrait'])) {
					$picture_url = end($network_data['person']['portraits']['portrait']);
					$picture_url = $picture_url['_content'];
				}				

				$old_account = $this->Socialnet->find('all', array(
					'conditions' => array(
						'Socialnet.external_user_id'	=> $network_data['person']['username'],
						'Socialnet.user_id'				=> $user_id,
						'Socialnet.network'				=> self::$network,
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
					'login'				=> $network_data['person']['display_name'],
					'network'			=> self::$network,
					'status'			=> 'Allowed',
					'token'				=> $access_token['oauth_token'],
					'secret'			=> $access_token['oauth_token_secret'],
					'external_user_id'	=> $network_data['person']['username'],
					'created'			=> date('Y-m-d H:i:s'),
					'profile_url'		=> $network_data['person']['profileurl'],
					'profile_image'		=> $picture_url,
					'stats'				=> json_encode($mo_socialnet->stats($params)),
				);

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
				$response_data = array(
					'status'	=> 'error',
					'status_msg'=> __('There is not a token'),
				);
				$this->set("response_data",$response_data);
				$this->render();				
			}

		} else {

			$response_data = array(
				'status'	=> 'error',
				'status_msg'=> __('There is not token'),
			);
			$this->set("response_data",$response_data);
			$this->render();

		}

	}

	public function collect() {

		$user_id = $this->Auth->user('id');

		$conditions = array('Socialnet.network' => self::$network);
		$params 	= array('Content.network'	=> self::$network);

		$this->layout = 'ajax';
		if (isset($user_id)) {
			$conditions['Socialnet.user_id'] = $user_id;
			$this->layout = 'user';
		}

		if (isset($this->request->query['account_id'])) {
			$conditions['Socialnet.id'] = $this->request->query['account_id'];
			$this->set("account_id",$conditions['Socialnet.id']);
		}

		$accounts = $this->Socialnet->find('all',array(
			'conditions'=> $conditions,
			'fields'	=> array('Socialnet.external_user_id')
			)
		);

		if ($accounts) {
			$account_ids = array();
			foreach ($accounts as $key => $value) {
				$account_ids[] = $value['Socialnet']['external_user_id'];
			}
			$params['Content.external_user_id'] = $account_ids;
		}

		$contents = $this->Content->find('all', array(
			'conditions'=> $params,
			'order'		=> array('Content.creation_date' => 'desc'),
			'limit'		=> '50',
			)
		);


		$data = array();
		foreach ($contents as $key => $value) {

			$value['Content']['data']	= unserialize($value['Content']['data']);
			$value['Content']['stats']	= unserialize($value['Content']['stats']);
			$data[] = $value['Content'];
		}

		$this->set("count",count($contents));

		if (isset($this->request->query['layout'])) {
			$this->layout = $this->request->query['layout'];
		}
		$content_types 	= VimeoSocialnet::$content_types;
		$types 			= $content_types;

		if (isset($this->request->query['types'])) {
			$types = $this->request->query['types'];
		}

        if($this->request->isAjax) {
            $this->layout = "ajax";
        }

		$this->view = 'free_embed';
		
		if (count($data)) {

			foreach ($data as $key => $value) {
				if (!in_array($value['concept'], $types)) {
					unset($data[$key]);
				}
			}

	 		usort($data, function ($a, $b) { return ($a['creation_date'] < $b['creation_date']); });

	 		$data = array_slice($data,0,20);
	 	}

	 	$networks = Socialnet::$networks;
		$this->set("network",self::$network);
	 	$this->set("title_for_layout",$networks[self::$network]);
		$this->set("app_id",VimeoSocialnet::APP_ID);
		$this->set("data",$data);
		$this->set("content_types",$content_types);
		$this->set("types",$types);
	}


}