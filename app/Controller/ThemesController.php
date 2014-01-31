<?php

App::import('model','Theme');
App::import('model','User');

class ThemesController extends AppController {

    static $theme = 'digest';

    public function beforeFilter() {

		$this->Auth->allow('index','view');
        $this->loadModel('User');
    }

    public function index() {

        $type = isset($this->request->query['type']) ? $this->request->query['type'] : Theme::$default;
        $username = isset($this->request->query['username']) ? $this->request->query['username'] : null;

        $user = array('username'=>$username);

        $this->layout = "/themes/{$type}/index";
        $findUser = $this->User->findByUsername($username);

        if (empty($findUser) || !$this->Auth->user('id')) {
            $this->redirect("/");
        }

        if ( !empty($user) && $this->Auth->user('id') == $findUser['User']['id'] ) {
            $user['id'] = $this->Auth->user('id');
        }

    	$this->set('user',json_encode($user));
    }

    public function view($type,$username) {

        $findUser = $this->User->findByUsername($username);
        $user_id= $findUser['User']['id'];
        $theme  = new Theme();
        $config = $theme->getThemeConfig($type,$user_id);
        $this->set(array(
            'config' => $config,
            '_serialize' => array('config')
        ));
    }

    public function setConfig() {

        $user_id= $this->Auth->user('id');
        $type   = isset($this->request->data['type'])  ? $this->request->data['type']     : Theme::$default;
        $config = isset($this->request->data['config'])? $this->request->data['config']   : null;
        $theme  = new Theme();
        $this->User->id = $user_id;
        $this->User->saveField('theme', $type );
        $theme->removeUserConfig($type,$user_id);
        $config = $theme->setThemeConfig($type,$user_id,$config);
        $this->set(array(
            'config' => $config,
            '_serialize' => array('config')
        ));        
    }

}