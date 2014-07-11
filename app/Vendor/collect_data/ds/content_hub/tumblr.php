<?php

App::import('Vendor', 'abstract', array('file' => 'collect_data/ds/content_hub/abstract.php'));
App::import('Vendor', 'stdclass', array('file' => 'fb_stdclass.php'));
App::import('model','Content');

class TumblrContentHubDs extends AbstractContentHubDs {

	const UPDATE_INTERVAL 		= "-2 weeks";

	protected static $network 	= "tumblr";

	protected function get_first_concept_for_network( $external_user_id, $concept ) {

		$params = array(
			'Content.network'			=> self::$network,
			'Content.concept'			=> $concept,
			'Content.external_user_id'	=> $external_user_id,
		);

		$content = new Content();

        $contents = $content->find('all', array(
            'conditions'=> $params,
            'order'     => array('Content.creation_date' => 'asc'),
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
			$api_params['offset'] = $params['since'];
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

		$photos	= $this->getPhotos($account, $params);
		if (!empty($photos))
		{
			$collected_data = array_merge($collected_data,$photos);
		}

		$quotes	= $this->getQuotes($account, $params);
		if (!empty($quotes))
		{
			$collected_data = array_merge($collected_data,$quotes);
		}

		$chats	= $this->getChats($account, $params);
		if (!empty($chats))
		{
			$collected_data = array_merge($collected_data,$chats);
		}

		$posts	= $this->getPosts($account, $params);
		if (!empty($posts))
		{
			$collected_data = array_merge($collected_data,$posts);
		}

		$tracks	= $this->getTracks($account, $params);
		if (!empty($tracks))
		{
			$collected_data = array_merge($collected_data,$tracks);
		}

		$videos	= $this->getVideos($account, $params);
		if (!empty($videos))
		{
			$collected_data = array_merge($collected_data,$videos);
		}

		$links	= $this->getLinks($account, $params);
		if (!empty($links))
		{
			$collected_data = array_merge($collected_data,$links);
		}

		return $collected_data;
	}

	private function getPhotos($account, $params) {

		$data 	= array();
		$concept= 'photo';

		$mo_socialnet = Socialnet::Factory(self::$network);
		$photos	= $mo_socialnet->getPhotos($account,$params);

		if (!isset($params['offset'])) {
			$first_concept= $this->get_first_concept_for_network($account['external_user_id'],'photo');
			if (!is_null($first_concept)) {
				$params['before_id'] = $first_concept["external_id"];
				$old_photos = $mo_socialnet->getPhotos($account,$params);
				if ($photos['meta']['status'] == 200 && $old_photos['meta']['status'] == 200) {
					$photos['response']['posts'] = array_merge($photos['response']['posts'],$old_photos['response']['posts']);
				}
			}
		}


		if ($photos['meta']['status'] == 200 && count($photos['response']['posts']) > 0)
		{
			foreach ($photos['response']['posts'] as $k=>$photo)
			{
				$photo['id']	= (string)$photo['id'];
				$date	= date("Y-m-d H:i:s",strtotime(substr($photo['date'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($photo['id'],$row);
				$row	= self::set_external_atomic_id_to_row($photo['id'],$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($photo,$row);

				$stats = array();
				!(empty($photo['note_count'])) ? $stats['activities'] = $photo['note_count']:null;

				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
		}
		return $data;
	}

	private function getQuotes($account, $params) {

		$data 	= array();
		$concept= 'quote';

		$mo_socialnet = Socialnet::Factory(self::$network);
		$quotes	= $mo_socialnet->getQuotes($account,$params);

		if (!isset($params['offset'])) {
			$first_concept= $this->get_first_concept_for_network($account['external_user_id'],'quote');
			if (!is_null($first_concept)) {
				$params['before_id'] = $first_concept["external_id"];
				$old_quotes = $mo_socialnet->getQuotes($account,$params);
				if ($quotes['meta']['status'] == 200 && $old_quotes['meta']['status'] == 200) {
					$quotes['response']['posts'] = array_merge($quotes['response']['posts'],$old_quotes['response']['posts']);
				}
			}
		}		


		if ($quotes['meta']['status'] == 200 && count($quotes['response']['posts']) > 0)
		{
			foreach ($quotes['response']['posts'] as $k=>$quote)
			{
				$quote['id']	= (string)$quote['id'];
				$date	= date("Y-m-d H:i:s",strtotime(substr($quote['date'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($quote['id'],$row);
				$row	= self::set_external_atomic_id_to_row($quote['id'],$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($quote,$row);	

				$stats = array();
				!(empty($quote['note_count'])) ? $stats['activities'] = $quote['note_count']:null;

				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
		}
		return $data;
	}

	
	private function getTracks($account, $params) {

		$data 	= array();
		$concept= 'track';

		$mo_socialnet = Socialnet::Factory(self::$network);
		$tracks	= $mo_socialnet->getTracks($account,$params);

		if (!isset($params['offset'])) {
			$first_concept= $this->get_first_concept_for_network($account['external_user_id'],'track');
			if (!is_null($first_concept)) {
				$params['before_id'] = $first_concept["external_id"];
				$old_tracks = $mo_socialnet->getTracks($account,$params);
				if ($tracks['meta']['status'] == 200 && $old_tracks['meta']['status'] == 200) {
					$tracks['response']['posts'] = array_merge($tracks['response']['posts'],$old_tracks['response']['posts']);
				}
			}
		}


		if ($tracks['meta']['status'] == 200 && count($tracks['response']['posts']) > 0)
		{
			foreach ($tracks['response']['posts'] as $k=>$track)
			{
				$track['id']	= (string)$track['id'];
				$date	= date("Y-m-d H:i:s",strtotime(substr($track['date'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($track['id'],$row);
				$row	= self::set_external_atomic_id_to_row($track['id'],$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($track,$row);

				$stats = array();
				!(empty($track['note_count'])) ? $stats['activities'] = $track['note_count']:null;
				!(empty($track['plays'])) ? $stats['plays'] = $track['plays']:null;

				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
		}
		return $data;
	}

	private function getPosts($account, $params) {

		$data 	= array();
		$concept= 'post';

		$mo_socialnet = Socialnet::Factory(self::$network);
		$posts	= $mo_socialnet->getPosts($account,$params);

		if (!isset($params['offset'])) {
			$first_concept= $this->get_first_concept_for_network($account['external_user_id'],'post');
			if (!is_null($first_concept)) {
				$params['before_id'] = $first_concept["external_id"];
				$old_posts = $mo_socialnet->getPosts($account,$params);
				if ($posts['meta']['status'] == 200 && $old_posts['meta']['status'] == 200) {
					$posts['response']['posts'] = array_merge($posts['response']['posts'],$old_posts['response']['posts']);
				}
			}
		}

		if ($posts['meta']['status'] == 200 && count($posts['response']['posts']) > 0)
		{
			foreach ($posts['response']['posts'] as $k=>$post)
			{
				$post['id']	= (string)$post['id'];
				$date	= date("Y-m-d H:i:s",strtotime(substr($post['date'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($post['id'],$row);
				$row	= self::set_external_atomic_id_to_row($post['id'],$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($post,$row);

				$stats = array();
				!(empty($post['note_count'])) ? $stats['activities'] = $post['note_count']:null;

				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
		}
		return $data;
	}


	private function getVideos($account, $params) {

		$data 	= array();
		$concept= 'video';

		$mo_socialnet = Socialnet::Factory(self::$network);
		$videos	= $mo_socialnet->getVideos($account,$params);

		if (!isset($params['offset'])) {
			$first_concept= $this->get_first_concept_for_network($account['external_user_id'],'video');
			if (!is_null($first_concept)) {
				$params['before_id'] = $first_concept["external_id"];
				$old_videos = $mo_socialnet->getVideos($account,$params);
				if ($videos['meta']['status'] == 200 && $old_videos['meta']['status'] == 200) {
					$videos['response']['posts'] = array_merge($videos['response']['posts'],$old_videos['response']['posts']);
				}
			}
		}


		if ($videos['meta']['status'] == 200 && count($videos['response']['posts']) > 0)
		{
			foreach ($videos['response']['posts'] as $k=>$video)
			{
				$video['id']	= (string)$video['id'];
				$date	= date("Y-m-d H:i:s",strtotime(substr($video['date'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($video['id'],$row);
				$row	= self::set_external_atomic_id_to_row($video['id'],$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($video,$row);

				$stats = array();
				!(empty($video['note_count'])) ? $stats['activities'] = $video['note_count']:null;

				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
		}
		return $data;
	}

	private function getLinks($account, $params) {

		$data 	= array();
		$concept= 'link';

		$mo_socialnet = Socialnet::Factory(self::$network);
		$links	= $mo_socialnet->getLinks($account,$params);

		if (!isset($params['offset'])) {
			$first_concept= $this->get_first_concept_for_network($account['external_user_id'],'link');
			if (!is_null($first_concept)) {
				$params['before_id'] = $first_concept["external_id"];
				$old_links = $mo_socialnet->getLinks($account,$params);
				if ($links['meta']['status'] == 200 && $old_links['meta']['status'] == 200) {
					$links['response']['posts'] = array_merge($links['response']['posts'],$old_links['response']['posts']);
				}
			}
		}


		if ($links['meta']['status'] == 200 && count($links['response']['posts']) > 0)
		{
			foreach ($links['response']['posts'] as $k=>$link)
			{
				$link['id']	= (string)$link['id'];
				$date	= date("Y-m-d H:i:s",strtotime(substr($link['date'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($link['id'],$row);
				$row	= self::set_external_atomic_id_to_row($link['id'],$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($link,$row);

				$stats = array();
				!(empty($link['note_count'])) ? $stats['activities'] = $link['note_count']:null;

				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
		}
		return $data;
	}


	private function getChats($account, $params) {

		$data 	= array();
		$concept= 'chat';

		$mo_socialnet = Socialnet::Factory(self::$network);
		$chats	= $mo_socialnet->getChats($account,$params);

		if (!isset($params['offset'])) {
			$first_concept= $this->get_first_concept_for_network($account['external_user_id'],'chat');
			if (!is_null($first_concept)) {
				$params['before_id'] = $first_concept["external_id"];
				$old_chats = $mo_socialnet->getChats($account,$params);
				if ($chats['meta']['status'] == 200 && $old_chats['meta']['status'] == 200) {
					$chats['response']['posts'] = array_merge($chats['response']['posts'],$old_chats['response']['posts']);
				}
			}
		}

		if ($chats['meta']['status'] == 200 && count($chats['response']['posts']) > 0)
		{
			foreach ($chats['response']['posts'] as $k=>$chat)
			{
				$chat['id']	= (string)$chat['id'];
				$date	= date("Y-m-d H:i:s",strtotime(substr($chat['date'],0,-5)));

				$row	= self::get_row_structure();
				$row 	= self::set_network_to_row(self::$network,$row);
				$row 	= self::set_concept_to_row($concept,$row);
				$row	= self::set_creation_date_to_row($date,$row);
				$row	= self::set_external_id_to_row($chat['id'],$row);
				$row	= self::set_external_atomic_id_to_row($chat['id'],$row);
				$row	= self::set_external_user_id_to_row($account['external_user_id'],$row);
				$row	= self::set_external_user_name_to_row($account['login'],$row);
				$row	= self::set_content_to_row($chat,$row);

				$stats = array();
				!(empty($chat['note_count'])) ? $stats['activities'] = $chat['note_count']:null;

				$row	= self::set_stats_to_row($stats,$row);

				$data[] = $row;
			}
		}
		return $data;
	}

}