<?php

App::import('model','User');
App::import('model','Theme');
App::import('model','Socialnet');

class UsersController extends AppController {

    public function beforeFilter() {

        $this->Auth->allow('register','login','index','view','setProfileImage');
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
                $findUser = $this->User->findById($this->Auth->user('id'));
                $this->set(array(
                    'message' => array(
                        'text' => __('You are logged!'),
                        'type' => 'success'
                    ),
                    'user' => array(
                        'id'            => $this->Auth->user('id'),
                        'username'      => $this->Auth->user('username'),
                        'profile_image' => $findUser['User']['profile_image'],
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

        $search = isset($this->request->data['search']) ? $this->request->data['search'] : '';
        isset($this->request->data['offset']) ? $offset= $this->request->data['offset']   : $offset   = 0;
        isset($this->request->data['limit'])  ? $limit = $this->request->data['limit']    : $limit    = 10;

        $users = $this->User->find('all', array(
            'conditions'=> array('or' => array(
                'User.username LIKE'=>"%{$search}%",
                'User.theme LIKE'=>"%{$search}%",
                'User.firstname LIKE'=>"%{$search}%",
                'User.lastname LIKE'=>"%{$search}%",
            )),
            'limit'     => $limit,
            'offset'    => $offset,
            'order'     => array('User.id' => 'desc'),
            )
        );

        if (!empty($users)) {
            foreach ($users as $key => $user) {
                unset($users[$key]['User']['password']);
            }
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
        $user['profile_image'] = $findUser['User']['profile_image'];

        $this->layout = "/themes/{$type}/index";
        $this->set('user',json_encode($user));
    }

    public function logout() {

        $this->redirect($this->Auth->logout());
    }

    public function register() {

        $this->set('user',json_encode(""));
        $this->layout = 'anonymous';        

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
                $data['User']['profile_image'] = User::$default_image;
                if($this->User->save($data)) {

                    $findUser = $this->User->findByUsername($data['User']['username']);

                    $account = array(
                        'user_id'           => $findUser['User']['id'],
                        'login'             => $data['User']['username'],
                        'network'           => 'cloudcial',
                        'external_user_id'  => $findUser['User']['id'],
                        'profile_url'       => 'http://cloudcial.com/users/'.$data['User']['username'],
                        'profile_image'     => User::$default_image,
                        'status'            => 'Allowed'
                    );
                    $this->Socialnet->save($account);

                    $this->Auth->login($findUser['User']);

                    $this->redirect('/');
                }
            }
        }
    }

    public function setProfileImage(){


        if (!$this->Auth->user('id')) {
            throw new Exception("Error Processing Request", 1);
        }

        $path = $this->request->data['path'];
        
        if ($this->request->is('post')) {
            $this->User->id = $this->Auth->user('id');
            $this->User->profile_image = $path;
            $this->User->saveField('profile_image', $path );
            $this->Session->write('Auth.User.profile_image', $path);
        }

        $this->layout = 'anonymous';
        $this->set(array(
            'path' => $path,
            '_serialize' => array('path')
        ));

    }

}