<?php

App::import('model','Theme');

class ThemesController extends AppController {

    static $theme = 'digest';

    public function beforeFilter() {

		$this->Auth->allow('index');

    }

    public function index() {

        $type = isset($this->request->query['type']) ? $this->request->query['type'] : self::$theme;

        $this->layout = "/themes/{$type}/index";

    	$user = array(
    		'id'		=> $this->Auth->user('id'),
    		'username'	=> $this->Auth->user('username')
    	);
    	$this->set('user',"{'id':".$this->Auth->user('id').",'username':'".$this->Auth->user('username')."'}");
    }

    public function getConfig() {

        $user_id= $this->Auth->user('id');
        $type   = isset($this->request->query['type']) ? $this->request->query['type'] : self::$theme;
        $theme  = new Theme();
        $config = $theme->getThemeConfig($type,$user_id);
        $this->set(array(
            'config' => $config,
            '_serialize' => array('config')
        ));
    }

    public function setConfig() {

        $user_id= $this->Auth->user('id');
        $type   = isset($this->request->data['type'])  ? $this->request->data['type']     : self::$theme;
        $config = isset($this->request->data['config'])? $this->request->data['config']   : null;
        $theme  = new Theme();
        $config = $theme->setThemeConfig($type,$user_id,$config);
        $this->set(array(
            'config' => $config,
            '_serialize' => array('config')
        ));        
    }    

}