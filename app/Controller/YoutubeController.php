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

}