<?php

class Crawler {
	private $config = null;
	private $response = '';
	private $url = '';
	private $info = array();
	private $opts = array();
	private $response_headers = array();
	private $errno = 0;
	private $ch = null;
	
	const USER_AGENT = 'Mozilla/5.0 (compatible; FanBridge/1.2; +http://www.fanbridge.com/contact.php)';


	public function get_errno() {
		return $this->errno;
	}

	public function is_error() {
		return ($this->error != 0);
	}

	public function get_url() {
		return $this->url;
	}

	public function get_response() {
		return $this->response; 
	}       

	public function __construct($url = null) {
		$this->url = $url;

	}
	
	protected function init() {
		$this->ch = curl_init();
		$this->set_default_opts();
	}
	
	protected function close() {
		curl_close($this->ch);
	}
	
	private function set_default_opts() {
		curl_setopt($this->ch, CURLOPT_USERAGENT, self::USER_AGENT);
		curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($this->ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($this->ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($this->ch, CURLOPT_HEADER, 1);
	}

	public function set_opt($opt, $value) {
		$this->opts[$opt] = $value;
		return true;
	}
	
	protected function override_opts() {
		foreach ($this->opts as $k => $v) {
			curl_setopt($this->ch, $k, $v);
		}
		return true;
	}
	

	public function get_info() {
		return $this->info;
	}

	public function get_header_response() {
		return $this->info['http_code'];
	}

	/**
	 * Executes the curl request
	 * @param string $url
	 */
	public function call_url($url = null) {
		
		$this->init();
		$this->override_opts();

		curl_setopt($this->ch, CURLOPT_URL, ($url == null ? $this->get_url() : $url));

		$response       = curl_exec($this->ch);
		$errno          = curl_errno($this->ch);
		$error          = curl_error($this->ch);

		$header_size = curl_getinfo($this->ch, CURLINFO_HEADER_SIZE);
		$this->response_headers = $this->parse_headers(substr($response, 0, $header_size));
		$response = substr($response, $header_size);

		if ($errno == CURLE_OK) {
			$this->response = $response;
			$this->info = curl_getinfo($this->ch);
		}
		else {
			$this->response = '';
			$this->errno = $errno;
		}
		
		$this->close();
		
		return strlen($response);
	}

	/**
	 * Return response headers as array or optionally just the header requested.
	 * @return mixed array|string
	 */
	public function get_response_headers($header = null) {

		if ($header)
		{
			if (isset($this->response_headers[$header]))
			{
				return $this->response_headers[$header];
			}
			return null;
		}
		return $this->response_headers;
	}

	/**
	 * Parse http header string into an array.
	 * @param string $header_string
	 * @return array
	 */
	private function parse_headers($headers_string) {

		$headers = array();

		$lines = explode("\n", $headers_string);

		if ($lines)
		{
			$headers = array('STATUS' => preg_replace("/\r/", '', array_shift($lines)));

			foreach ($lines as $line)
			{
				$header = preg_split("/\:/", $line, 2);

				if (count($header) > 1)
				{
					// all keys are uppercased and "-" are replaced with "_"
					$headers[str_replace('-', '_', strtoupper($header[0]))] = preg_replace("/\r/", '', $header[1]);
				}
			}
		}

		return $headers;
	}

}


