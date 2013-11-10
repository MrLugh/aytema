<?php

App::import('Vendor', 'abstract', array('file' => 'collect_data/ds/content_hub/abstract.php'));
App::import('Vendor', 'stdclass', array('file' => 'fb_stdclass.php'));
App::import('Model','Content');

class YoutubeContentHubDs extends AbstractContentHubDs {

	const VIDEO_ID			= "http://gdata.youtube.com/feeds/api/videos/";
	const IMG				= "http://img.youtube.com/vi/video_id/hqdefault.jpg";
	const UPDATE_INTERVAL	= "- 4 weeks";

	protected static $network 	= "youtube";

	private static function format_video_id($id)	{

		return str_replace(self::VIDEO_ID, '', $id);
	}

	private static function format_youtube_date($date)	{

		return date("Y-m-d H:i:s", strtotime(substr($date, 0, -5)));
	}

	protected function get_count_concept_for_network($external_user_id, $concept ) {

		// count videos
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

        return count($contents);

	}

	protected function processFetchParams ( $params ) {

		$api_params = array();

		if (isset($params['limit']))
		{
			$api_params['max-results'] = $params['limit'];
		}
		if (isset($params['since']))
		{
			$api_params['start-index'] = $params['since'];
		}
		if (isset($params['all'])) {
			$api_params['all'] = $params['all'];
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

		$count	= $this->get_count_concept_for_network($account['external_user_id'], 'video');

		$mo_socialnet = Socialnet::Factory(self::$network);

		$videos = array();
		if (!$count || (isset($params['all']))) {
			$videos	= $mo_socialnet->getAllVideos($account,$params);
		} else {
			$feed	= $mo_socialnet->getVideos($account,$params);
			if ($feed !== false && isset($feed['feed']['entry'])) {
				$videos = $feed['feed']['entry'];
			}
		}

		if (count($videos))
		{
			$one_video = false;
			$rows = array();

			foreach ($videos as $k=>&$v)
			{

				// more than one video.
				if (is_numeric($k))
				{						          
					$video_id = $v['media$group']['yt$videoid']['$t'];
					$date = self::format_youtube_date($v['published']['$t']);

					$v['thumbnail']= str_replace('video_id',$video_id,self::IMG);
					$v['title'] = $v['title']['$t'];
					$v['content'] = $v['media$group']['media$description']['$t'];
					$v['author'] = array(
									'name'=>$v['author'][0]['name']['$t'],
									'uri'=>$v['author'][0]['uri']['$t'],
									'yt$userId'=>$v['author'][0]['yt$userId']['$t']
								   );

					$row = self::get_row_structure();
					$row = self::set_network_to_row(self::$network,$row);
					$row = self::set_concept_to_row($concept,$row);					
					$row = self::set_creation_date_to_row($date, $row);
					$row = self::set_external_id_to_row($video_id, $row);
					$row = self::set_external_atomic_id_to_row($video_id,$row);
					$row = self::set_external_user_id_to_row($account['external_user_id'],$row);
					$row = self::set_external_user_name_to_row($account['login'],$row);
					$row = self::set_content_to_row($v, $row);

					$stats = array();

					$stats['comments']	= (isset($v['gd$comments']['gd$feedLink']['countHint']))? (int)$v['gd$comments']['gd$feedLink']['countHint']: 0;
					$stats['favorites']	= (isset($v['yt$statistics']['favoriteCount']))			? (int)$v['yt$statistics']['favoriteCount']			: 0;
					$stats['views']		= (isset($v['yt$statistics']['viewCount']))				? (int)$v['yt$statistics']['viewCount']				: 0;
					$stats['likes']		= (isset($v['yt$rating']['numLikes']))					? (int)$v['yt$rating']['numLikes']					: 0;
					$stats['dislikes']	= (isset($v['yt$rating']['numDislikes']))				? (int)$v['yt$rating']['numDislikes']				: 0;

					$row	= self::set_stats_to_row($stats,$row);

					$data[] = $row;

				} else {

					$one_video = true;
					switch($k)
					{
						case 'id':
							$video_id = self::format_video_id($v);
						case 'published':
							$date	= self::format_youtube_date($v);
						default:
							$rows = array_merge($rows, array($k => $v));
					}
				}

				if ($one_video)
				{
					$rows['thumbnail']= str_replace('video_id',$video_id,self::IMG);
					$row = self::get_row_structure();
					$row = self::set_network_to_row(self::$network,$row);
					$row = self::set_concept_to_row($concept,$row);					
					$row = self::set_creation_date_to_row($date, $row);
					$row = self::set_external_id_to_row($video_id, $row);
					$row = self::set_external_atomic_id_to_row($video_id,$row);
					$row = self::set_external_user_id_to_row($account['external_user_id'],$row);
					$row = self::set_external_user_name_to_row($account['login'],$row);
					$row = self::set_content_to_row($rows, $row);

					$stats = array();

					$stats['comments']	= (isset($rows['gd$comments']['gd$feedLink']['countHint']))	? (int)$rows['gd$comments']['gd$feedLink']['countHint']	: 0;
					$stats['favorites']	= (isset($rows['yt$statistics']['favoriteCount']))			? (int)$rows['yt$statistics']['favoriteCount']			: 0;
					$stats['views']		= (isset($rows['yt$statistics']['viewCount']))				? (int)$rows['yt$statistics']['viewCount']				: 0;
					$stats['likes']		= (isset($rows['yt$rating']['numLikes']))					? (int)$rows['yt$rating']['numLikes']					: 0;
					$stats['dislikes']	= (isset($rows['yt$rating']['numDislikes']))				? (int)$rows['yt$rating']['numDislikes']				: 0;

					$row	= self::set_stats_to_row($stats,$row);

					$data[] = $row;	
				}

			}

		}
		return $data;
	}

}
