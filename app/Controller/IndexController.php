<?php

class IndexController extends AppController {

    public function beforeFilter() {

        $this->Auth->allow('home','dashboard');

    }


    public function home() {

    	$user = array();
        $this->layout = "landing";

    	if ($this->Auth->user('id')) {
	    	$user = array(
	    		'id' => $this->Auth->user('id'),
	    		'username' => $this->Auth->user('username'),
                'profile_image' => $this->Auth->user('profile_image'),
	    	);
    	}
    	$this->set('user',$user);
    }


    public function dashboard() {

    	$user = array();
    	$this->view = 'home';

    	if ($this->Auth->user('id')) {
	    	$user = array(
	    		'id' => $this->Auth->user('id'),
	    		'username' => $this->Auth->user('username'),
                'profile_image' => $this->Auth->user('profile_image'),
	    	);
    	}
    	$this->set('user',$user);
    }


}