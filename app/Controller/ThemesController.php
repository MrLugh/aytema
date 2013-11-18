<?php

class ThemesController extends AppController {

    public function beforeFilter() {

		$this->Auth->allow('index');

    }


    public function index() {

        $this->layout = "/themes/digest/index";

    	$user = array(
    		'id'		=> $this->Auth->user('id'),
    		'username'	=> $this->Auth->user('username')
    	);
    	$this->set('user',"{'id':".$this->Auth->user('id').",'username':'".$this->Auth->user('username')."'}");        
    }

}