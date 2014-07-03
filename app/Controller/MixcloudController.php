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

		//ONLY FOR TESTING
		$this->Auth->allow('collect');
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
		$content_types 	= MixcloudSocialnet::$content_types;
		$types 			= $content_types;

		if (isset($this->request->query['types'])) {
			$types = $this->request->query['types'];
		}

        if($this->request->isAjax) {
            $this->layout = "ajax";
        }

		$this->view = 'free_embed';
		
	 	$networks = Socialnet::$networks;
		$this->set("network",self::$network);
	 	$this->set("title_for_layout",$networks[self::$network]);
		$this->set("app_id",MixcloudSocialnet::APP_ID);
		$this->set("data",$data);
		$this->set("content_types",$content_types);
		$this->set("types",$types);
	}


}