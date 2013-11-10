<?php

App::import('Vendor', 'abstract', array('file' => 'collect_data/ds/content_hub/abstract.php'));
App::import('model','Content');

class FacebookContentHubDs extends AbstractContentHubDs {

	const UPDATE_INTERVAL 		= "- 2 weeks";

	protected static $network 	= "facebook";

	protected function get_last_concept_for_network( $external_user_id) {

		$params = array(
			'Content.network'			=> self::$network,
			'Content.external_user_id'	=> $external_user_id,
		);

		$content = new Content();

        $contents = $content->find('all', array(
            'conditions'=> $params,
            'order'     => array('Content.creation_date' => 'desc'),
            'limit'     => '1',
            )
        );

        if (count($contents)) {
        	$content = array_shift($contents);
        	return $content['Content'];
        }

		return null;
	}

	protected function processFetchParams ( $params ) {

		$api_params	= array();
	
		if (!isset($params['limit']))
		{
			$api_params['limit'] = 1000;
		}
		else
		{
			$api_params['limit'] = $params['limit'];
		}
		if (isset($params['since']))
		{
			$api_params['since'] = $params['since'];
		}

		return $api_params;
	}

	/**
	 * Fetch data 
	 *
	 * @param array account
	 * @param array assoc params ('limit'=>integer,'since'=> str/timestamp )
	 * @return array assoc data name_concept => data
	 */
	public function fetch( $account, $params = array() ) {

		$params	= $this->processFetchParams($params);

		$collected_data= array();

		$feed	= $this->getFeed($account, $params);
		if (!empty($feed))
		{
			$collected_data = array_merge($collected_data,$feed);
		}

		/*
		$posts	= $this->getPosts($account, $params);
		if (!empty($posts))
		{
			$collected_data = array_merge($collected_data,$posts);
		}

		$photos	= $this->getPhotos($account, $params);
		if (!empty($photos))
		{
			$collected_data = array_merge($collected_data,$photos);
		}

		$videos	= $this->getVideos($account, $params);
		if (!empty($videos))
		{
			$collected_data = array_merge($collected_data,$videos);
		}
		*/

		return $collected_data;
	}

	private function getFeed($account, $params) {

		$data 	= array();

		if (!isset($params['since']))
		{
			$last_concept= $this->get_last_concept_for_network($account['external_user_id']);
			(!is_null($last_concept)) ? $params['since'] = $last_concept["creation_date"] : null;
		}

		$mo_socialnet = Socialnet::Factory(self::$network);
		$feed	= $mo_socialnet->getFeed($account,$params);

		if (isset($feed['data']) and count($feed['data']))
		{

			foreach ($feed['data'] as $k=>$feed)
			{
				$concept = $feed['type'];
				if (!in_array($concept, array("video","photo"))) {
					$concept = 'post';
				}

				$date	= date("Y-m-d H:i:s",strtotime(substr($feed['created_time'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($feed['id'],$row);
				$row	= self::set_external_atomic_id_to_row(end(explode('_',$feed['id'])),$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($feed,$row);

				$stats = array();

				$stats['likes']		= (isset($feed['likes']['data']))		? count($feed['likes']['data'])		: 0;
				$stats['comments']	= (isset($feed['comments']['data']))	? count($feed['comments']['data'])	: 0;
				$row	= self::set_stats_to_row($stats,$row);
				
				$data[] = $row;
			}
		}
		return $data;
	}	

	/*
	private function getPosts($account, $params) {

		$data 	= array();
		$concept= 'post';

		if (!isset($params['since']))
		{
			$last_concept= $this->get_last_concept_for_network($account['external_user_id'],$concept);
			(!is_null($last_concept)) ? $params['since'] = $last_concept["creation_date"] : null;
		}

		$mo_socialnet = Socialnet::Factory(self::$network);
		$posts	= $mo_socialnet->getPosts($account,$params);

		if (isset($posts['posts']['data']) and count($posts['posts']['data']))
		{

			foreach ($posts['posts']['data'] as $k=>$post)
			{
				echo "<pre>";var_dump($post['type']);echo "</pre>";

				$date	= date("Y-m-d H:i:s",strtotime(substr($post['created_time'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($post['id'],$row);
				$row	= self::set_external_atomic_id_to_row(end(explode('_',$post['id'])),$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($post,$row);

				$stats = array();

				$stats['likes']		= (isset($post['likes']['data']))		? count($post['likes']['data'])		: 0;
				$stats['comments']	= (isset($post['comments']['data']))	? count($post['comments']['data'])	: 0;
				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
			exit;
		}
		return $data;
	}

	private function getPhotos($account, $params) {

		$data 	= array();
		$concept= 'photo';

		if (!isset($params['since']))
		{
			$last_concept= $this->get_last_concept_for_network($account['external_user_id'],$concept);
			(!is_null($last_concept)) ? $params['since'] = $last_concept["creation_date"] : null;
		}

		$mo_socialnet = Socialnet::Factory(self::$network);
		$photos	= $mo_socialnet->getPhotos($account,$params);

		if ($photos !==false and count($photos['data']))
		{
			foreach ($photos['data'] as $k=>$photo)
			{
				$date	= date("Y-m-d H:i:s",strtotime(substr($photo['created_time'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($photo['id'],$row);
				$row	= self::set_external_atomic_id_to_row(end(explode('_',$photo['id'])),$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($photo,$row);

				$stats = array();

				$stats['likes']		= (isset($photo['likes']['data']))		? count($photo['likes']['data'])		: 0;
				$stats['comments']	= (isset($photo['comments']['data']))	? count($photo['comments']['data'])	: 0;
				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
		}
		return $data;
	}

	private function getVideos($account, $params) {

		$data 	= array();
		$concept= 'video';

		if (!isset($params['since']))
		{
			$last_concept= $this->get_last_concept_for_network($account['external_user_id'],$concept);
			(!is_null($last_concept)) ? $params['since'] = $last_concept["creation_date"] : null;
		}

		$mo_socialnet = Socialnet::Factory(self::$network);
		$videos	= $mo_socialnet->getVideos($account,$params);


		if ($videos !==false and count($videos['data']))
		{
			foreach ($videos['data'] as $k=>$video)
			{
				$date	= date("Y-m-d H:i:s",strtotime(substr($video['created_time'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($video['id'],$row);
				$row	= self::set_external_atomic_id_to_row(end(explode('_',$video['id'])),$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($video,$row);

				$stats = array();

				$stats['likes']		= (isset($video['likes']['data']))		? count($video['likes']['data'])		: 0;
				$stats['comments']	= (isset($video['comments']['data']))	? count($video['comments']['data'])	: 0;
				$row	= self::set_stats_to_row($stats,$row);


				$data[] = $row;
			}
		}
		return $data;
	}
	*/

}
