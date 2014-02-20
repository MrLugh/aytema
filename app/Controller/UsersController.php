<?php

App::import('model','Theme');
App::import('model','Socialnet');

class UsersController extends AppController {

    public function beforeFilter() {

        $this->Auth->allow('register','login','index','view');
        $this->loadModel('Theme');
        $this->loadModel('Socialnet');

        $this->Auth->fields = array(
            'username'          => 'username',
            'password'          => 'secretword',
        );
    }

    public function login() {

        $this->layout = 'anonymous';

        if ($this->request->is('post')) {
            $this->request->data['User'] = $this->request->data ;
            if ($this->Auth->login()) {
                $this->User->id = $this->Auth->user('id');
                $this->User->saveField('last_login', date('Y-m-d H:i:s') );
                $this->set(array(
                    'message' => array(
                        'text' => __('You are logged!'),
                        'type' => 'success'
                    ),
                    'user' => array(
                        'id'        => $this->Auth->user('id'),
                        'username'  => $this->Auth->user('username')
                    ),
                    '_serialize' => array('message','user')
                ));
            } else {
                $this->set(array(
                    'message' => array(
                        'text' => __('Invalid username or password, try again'),
                        'type' => 'error'
                    ),
                    '_serialize' => array('message')
                ));
                $this->response->statusCode(401);
            }
        }
    }

    public function index() {

        $username = isset($this->request->query['username']) ? $this->request->query['username'] : '';
        $users = array();
        if (!empty($username)) {
            $users = $this->User->find('all', array(
                'conditions'=> array('User.username like'=>"%{$username}%"),
                )
            );
        }

        $this->set(array(
            'users' => $users,
            '_serialize' => array('users')
        ));
    }

    public function view($username) {
        $findUser = $this->User->findByUsername($username);
        if (empty($findUser)) {
            $this->redirect("/");
        }

        $user = array('username'=>$findUser['User']['username']);
        $type = $findUser['User']['theme'];
        if ( $this->Auth->user('id') == $findUser['User']['id'] ) {
            $user['id'] = $this->Auth->user('id');
        }

        $this->layout = "/themes/{$type}/index";
        $this->set('user',json_encode($user));
    }

    public function logout() {

        $this->redirect($this->Auth->logout());
    }

    public function register() {

        $this->set('user',json_encode(""));

        if (isset($this->request->data['User']['username'])) {
            $this->request->data['User']['username'] = strtolower($this->request->data['User']['username']);
        }

        if ($this->data &&
            isset($this->data['User']['password']) &&
            isset($this->data['User']['password'])) {

            if ($this->data['User']['password'] === $this->data['User']['password_confirm']) {
                $this->User->create();
                $data = $this->data;
                $data['User']['theme'] = Theme::$default;
                if($this->User->save($data)) {

                    $findUser = $this->User->findByUsername($data['User']['username']);

                    $account = array(
                        'user_id'           => $findUser['User']['id'],
                        'login'             => $data['User']['username'],
                        'network'           => 'aytema',
                        'external_user_id'  => $findUser['User']['id'],
                        'profile_url'       => 'http://cloudcial.com/users/'.$data['User']['username'],
                        'status'            => 'Allowed'
                    );
                    $this->Socialnet->save($account);
                    $this->redirect('/');
                }
            }
        }
    }

}