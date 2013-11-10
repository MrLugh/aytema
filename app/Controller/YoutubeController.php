<?php

App::import('model','Socialnet');
App::import('model','Content');

/* ONLY FOR TEST  */
App::import('Vendor', 'CollectData', array('file' => 'collect_data/collect_data.php'));

class YoutubeController extends AppController {

	public static $network = "youtube";

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
		$action 	= isset($this->request->query['action'])	? $this->request->query['action']	: null;
		$code		= isset($this->request->query['code'])		? $this->request->query['code']		: null;		

		$this->set('network', $network);

		$user_id = $this->Auth->user('id');
		$mo_socialnet = $this->Socialnet->Factory($network);

		$client = $mo_socialnet->googleClient();
		$oauth2 = $mo_socialnet->googleOauth();

		if ( $action && $action == "start" ) {
			return $this->redirect($client->createAuthUrl());
		} else if ($code) {

			try {

				if($client->authenticate($code)) {

					$token 	= json_decode($client->getAccessToken(),true);
					$user 	= $oauth2->userinfo->get();
					$expires= date("Y-m-d H:i:s", time() + $token['expires_in']);

					$mo_socialnet->setOauth2Secret($token['access_token']);
					$mo_socialnet->setRefreshToken($token['refresh_token']);
					$mo_socialnet->setTokenExpire($token['expires_in']);
					$mo_socialnet->setExternalUserId($user['id']);

					$profile_url = null;

					// This can throw YouTube_API_Exception if the user doesn't have a channel created.
					$new_token = $mo_socialnet->refreshAccessToken();
					if ($new_token['status'] == 'success')  {

						if (!isset($new_token['data'])) {
							//WTF?
						}
					}
					
					$stats = array();
					$profile= $mo_socialnet->getProfile();

					if ($profile && isset($profile['entry']['link'][0]['href'])) {
						$profile_url = $profile['entry']['link'][0]['href'];

						$stats['subscribers']	= $profile['entry']['yt$statistics']['subscriberCount'];
						$stats['views']			= $profile['entry']['yt$statistics']['totalUploadViews'];
						

					} else {
						
						$msg = $view->element('flash/error', array('message'=>__('Please click <a target="_blank" href="https://www.youtube.com/channel_switcher">here</a> to create a channel and link your account again')));
						$response_data = array(
							'status'	=> 'error',
							'status_msg'=> $msg,
						);
						$this->set("response_data",$response_data);
						$this->render();
					}

					$picture_url = "";
					if (isset($profile['entry']['media$thumbnail']['url'])) {
						$picture_url = $profile['entry']['media$thumbnail']['url'];
					}

					$account = $this->Socialnet->find('all', array(
		       			'conditions' => array(
		       				'Socialnet.user_id'				=> $user_id,
		       				'Socialnet.network'				=> self::$network,
		       				'Socialnet.external_user_id'	=> $user['id'],
		       				'Socialnet.status'				=> 'Allowed',
		       				)
		    			)
		    		);

		    		$save = array(
		    			'network'			=> self::$network,
		    			'status'			=> 'Allowed',
		    			'login'				=> $user['name'],
		    			'token'				=> $token['access_token'],
		    			'secret'			=> $token['access_token'],
		    			'external_user_id'	=> $user['id'],
		    			'user_id'			=> $user_id,
		    			'created'			=> date('Y-m-d H:i:s'),
		    			'refresh_token'		=> $token['refresh_token'],
		    			'expiration'		=> $expires,
		    			'profile_url'		=> $profile_url,
		    			'profile_image'		=> $picture_url,		    			
		    			'type'				=> preg_match('/pages.plusgoogle.com/',$user['email']) ? 'page' : '',
		    			'stats'				=> json_encode($stats),
		    		);

		    		if (count($account)) {
						
						$account = array_shift($account);
						$save['id'] = $account['Socialnet']['id'];
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

				}

				else {
					$response_data = array(
						'status'	=> 'error',
						'status_msg'=> __('There is a problem adding the account'),
					);
					$this->set("response_data",$response_data);
					$this->render();					
				}

			} catch(YouTube_API_Exception $e) {

				$msg = $view->element('flash/error', array('message'=>__('Please click <a target="_blank" href="https://www.youtube.com/channel_switcher">here</a> to create a channel and link your account again')));
				$response_data = array(
					'status'	=> 'error',
					'status_msg'=> $msg,
				);
				$this->set("response_data",$response_data);
				$this->render();

			} catch (Exception $e) {

				$msg = $view->element('flash/error', array('message'=>__('Missing code param')));
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
		$content_types 	= YoutubeSocialnet::$content_types;
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
		$this->set("app_id",YoutubeSocialnet::APP_ID);
		$this->set("data",$data);
		$this->set("content_types",$content_types);
		$this->set("types",$types);
	}


}