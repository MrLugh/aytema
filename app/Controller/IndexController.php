<?php

class IndexController extends AppController {

    public function home() {

    	$user = array(
    		'id'		=> $this->Auth->user('id'),
    		'username'	=> $this->Auth->user('username')
    	);
    	$this->set('user',"{'id':".$this->Auth->user('id').",'username':'".$this->Auth->user('username')."'}");
    }

}