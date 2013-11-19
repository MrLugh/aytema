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

        $type   = isset($this->request->query['type'])  ? $this->request->query['type']     : self::$theme;
        $default= "Themes{$type}Controller";
        $config = isset($this->request->query['config'])? $this->request->query['config']   : $default::$config;
    }    

}