<?php

App::import('model','Socialnet');
App::import('model','FacebookSocialnet');
App::import('model','SoundcloudSocialnet');


abstract class AbstractContentHubDs {

	const COLLECT_INTERVAL	= "- 4 weeks";

	abstract public function fetch($account, $params = array());
	
	/**
	 * Generate an empty structure
	 *
	 * @return array with an empty structure
	 */	

	public static function get_row_structure () {

		return array(
			'network'			=> null,
			'concept'			=> null,
			'external_id'		=> null,
			'external_user_id'	=> null,
			'external_user_name'=> null,
			'external_atomic_id'=> null,
			'creation_date'		=> null,
			'stats'				=> null,
			'data'				=> null,
		);
	}

	/**
	 * Set content to row
	 *
	 * @return array with the modified row
	 */

	public static function set_content_to_row($content,$row) {

		$row['data']= $content;
		return $row;
	}

	/**
	 * Set stats to row
	 *
	 * @return array with the modified row
	 */

	public static function set_stats_to_row($stats,$row) {

		$row['stats']= $stats;
		return $row;
	}	

	/**
	 * Set network to row
	 *
	 * @return array with the modified row
	 */

	public static function set_network_to_row($network,$row) {

		$row['network']= $network;
		return $row;
	}


	/**
	 * Set concept to row
	 *
	 * @return array with the modified row
	 */

	public static function set_concept_to_row($concept,$row) {

		$row['concept']= $concept;
		return $row;
	}

	/**
	 * Set external_id to row
	 *
	 * @return array with the modified row
	 */

	public static function set_external_id_to_row($id,$row) {

		$row['external_id']= $id;
		return $row;
	}

	/**
	 * Set external_atomic_id to row
	 *
	 * @return array with the modified row
	 */

	public static function set_external_atomic_id_to_row($id,$row) {

		$row['external_atomic_id']= $id;
		return $row;
	}	

	/**
	 * Set external_user_id to row
	 *
	 * @return array with the modified row
	 */

	public static function set_external_user_id_to_row($id,$row) {

		$row['external_user_id']= $id;
		return $row;
	}

	/**
	 * Set external_user_name to row
	 *
	 * @return array with the modified row
	 */

	public static function set_external_user_name_to_row($name,$row) {

		$row['external_user_name']= $name;
		return $row;
	}		

	/**
	 * Set creation_date to row
	 *
	 * @return array with the modified row
	 */

	public static function set_creation_date_to_row($date,$row) {

		$row['creation_date']= $date;
		return $row;
	}

	/**
	 * Factory for Ds_Content_Hub_Abstract
	 *
	 * @param string $network name's network (Required)
	 * @return Ds_Content_Hub_$network
	 */
	public static function factory( $network ) {

		App::import('Vendor', "content_hub_".$network, array('file' => "collect_data/ds/content_hub/{$network}.php"));

		$class = $network."ContentHubDs";
		$my_object = new $class ();

		return $my_object;
	}

}
