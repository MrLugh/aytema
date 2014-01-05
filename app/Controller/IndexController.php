<?php

class IndexController extends AppController {

    public function beforeFilter() {

        $this->Auth->allow('home');

    }


    public function home() {

    	$user = array();

    	if ($this->Auth->user('id')) {
	    	$user = array(
	    		'id'		=> $this->Auth->user('id'),
	    		'username'	=> $this->Auth->user('username')
	    	);
    	}
    	$this->set('user',json_encode($user));
    }

}