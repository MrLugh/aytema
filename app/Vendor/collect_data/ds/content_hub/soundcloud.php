<?php

App::import('Vendor', 'abstract', array('file' => 'collect_data/ds/content_hub/abstract.php'));
App::import('Vendor', 'stdclass', array('file' => 'fb_stdclass.php'));
App::import('model','Content');

class SoundcloudContentHubDs extends AbstractContentHubDs {

	const UPDATE_INTERVAL 		= "- 2 weeks";

	protected static $network 	= "soundcloud";

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

		$tracks	= $this->getTracks($account, $params);
		if (!empty($tracks))
		{
			$collected_data = array_merge($collected_data,$tracks);
		}

		return $collected_data;
	}

	private function getTracks($account, $params) {

		$data 	= array();
		$concept= 'track';

		if (!isset($params['since']))
		{
			$last_concept= $this->get_last_concept_for_network($account['external_user_id'],$concept);
			(!is_null($last_concept)) ? $params['since'] = $last_concept["creation_date"] : null;
		}

		$mo_socialnet = Socialnet::Factory(self::$network);
		$tracks	= $mo_socialnet->getTracks($account,$params);

		if ($tracks !==false and count($tracks))
		{
			$tracks = Fb_stdclass::object_to_array($tracks);
			foreach ($tracks as $k=>$track)
			{
				$track['id']	= (string)$track['id'];
				$date	= date("Y-m-d H:i:s",strtotime(substr($track['created_at'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($track['id'],$row);
				$row	= self::set_external_atomic_id_to_row($track['id'],$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($track,$row);

				$stats = array(
					'plays'		=> $track['playback_count'],
					'comments'	=> $track['comment_count'],
					'favorites'	=> $track['favoritings_count'],
					'downloads'	=> $track['download_count'],
				);

				$row	= self::set_stats_to_row($stats,$row);				

				$data[] = $row;
			}
		}
		return $data;
	}

}
