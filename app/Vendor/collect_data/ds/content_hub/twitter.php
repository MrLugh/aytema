<?php

App::import('Vendor', 'abstract', array('file' => 'collect_data/ds/content_hub/abstract.php'));
App::import('Vendor', 'stdclass', array('file' => 'fb_stdclass.php'));
App::import('model','Content');

class TwitterContentHubDs extends AbstractContentHubDs {

	const UPDATE_INTERVAL 		= "- 2 weeks";

	protected static $network 	= "twitter";

	protected function get_last_concept_for_network( $external_user_id, $concept ) {

		$params = array(
			'Content.network'			=> self::$network,
			'Content.concept'			=> $concept,
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

		$api_params = array();

		if (isset($params['limit']))
		{
			$api_params['limit'] = $params['limit'];
		}

		if (isset($params['since_id']))
		{
			$api_params['since_id'] = $params['since_id'];
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

		$posts	= $this->getPosts($account, $params);
		if (!empty($posts))
		{
			$collected_data = array_merge($collected_data,$posts);
		}

		return $collected_data;
	}

	private function getPosts($account, $params) {

		$data 	= array();
		$concept= 'post';

		if (!isset($params['since_id']))
		{
			$last_concept= $this->get_last_concept_for_network($account['external_user_id'],$concept);
			(!is_null($last_concept)) ? $params['since_id'] = $last_concept["external_id"] : $params['limit'] = '50';
		}

		$mo_socialnet = Socialnet::Factory(self::$network);
		$posts	= $mo_socialnet->getPosts($account,$params);

		if ($posts !==false and count($posts))
		{
			$posts = Fb_stdclass::object_to_array($posts);
			foreach ($posts as $k=>$post)
			{
				$split= explode(" ",$post['created_at']);
				unset($split[count($split) -2]);
				$date	= date("Y-m-d H:i:s",strtotime(implode(" ",$split)));
				$post['id'] = $post['id_str'];

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($post['id'],$row);
				$row	= self::set_external_atomic_id_to_row($post['id'],$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($post,$row);

				$stats = array(
					'retweets'	=> $post['retweet_count'],
					'favorites'	=> $post['favorite_count'],
				);

				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
		}

		return $data;
	}

}
