<?php

App::import('Vendor', 'abstract', array('file' => 'collect_data/ds/content_hub/abstract.php'));

class VimeoContentHubDs extends AbstractContentHubDs {

	const UPDATE_INTERVAL 		= "-2 weeks";

	protected static $network 	= "vimeo";

	protected function get_last_concept_for_network( $external_user_id, $concept ) {

		/*		
		$sort	= array("content.creation_date"=>-1);

		$socialnet	= $this->get_socialnet();
		$records	= $this->get_mo_contenthub()->get_records_by_network_userid_concept($user_id,$socialnet->get_user_id(), $concept, $creation_date, $other_where, $fields)->sort($sort)->limit(1);
		if ($records->count())
		{
			$item = $records->getNext();
			return $item["content"];
		}
		*/
		return array('creation_date'=> date("Y-m-d H:i:s",strtotime("now ".self::COLLECT_INTERVAL)));
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

		$videos	= $this->getVideos($account, $params);
		if (!empty($videos))
		{
			$collected_data = array_merge($collected_data,$videos);
		}

		return $collected_data;
	}

	private function getVideos($account, $params) {

		$data 	= array();
		$concept= 'video';

		/*
		if (!isset($params['since']))
		{
			$last_concept= $this->get_last_concept_for_network($account['external_user_id'],$concept);
			(!is_null($last_concept)) ? $params['since'] = $last_concept["creation_date"] : null;
		}
		*/

		$mo_socialnet = Socialnet::Factory(self::$network);
		$videos	= $mo_socialnet->getVideos($account,$params);

		if ($videos !==false and count($videos))
		{
			foreach ($videos['videos']['video'] as $k=>$video)
			{
				$date	= $video['upload_date'];
				$video['id'] = $video['id'];

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($video['id'],$row);
				$row	= self::set_external_atomic_id_to_row($video['id'],$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($video,$row);

				// Each video needs another request to get stats
				$stats = array();

				$stats['plays']		= $video['number_of_plays'];
				$stats['likes']		= $video['number_of_likes'];
				$stats['comments']	= $video['number_of_comments'];

				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
		}
		return $data;
	}

}