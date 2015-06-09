<?php

App::import('model','User');
App::import('model','Theme');
App::import('model','Socialnet');
App::uses('Validation', 'Utility');

class UsersController extends AppController {

    public function beforeFilter() {

        $this->Auth->allow(
            'register',
            'login',
            'logout',
            'index',
            'view',
            'setProfileImage',
            'usersInSocialnet',
            'setInformation'
        );

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
            $this->request->data['User'] = $this->request->data;
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
                        'theme'         => $findUser['User']['theme'],
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
        if (!$this->request->is('post')) {
            $this->redirect("/dashboard");
        }
    }

    public function index() {

        if (!$this->request->is('post')) {
            $this->redirect("/dashboard/#/users");
        }

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
        if (!$this->request->is('post')) {
            $this->redirect($this->Auth->logout());
        } else {
            $this->Auth->logout();
            $this->set(array(
                'message' => array(
                    'text' => __('Logout'),
                ),
                '_serialize' => array('message')
            ));            
        }

    }

    public function register() {

        $this->set('user',json_encode(""));
        $this->layout = 'anonymous';     

        if ($this->request->data) {
            $this->request->data['User'] = $this->request->data;
            $this->request->data['User']['username'] = strtolower($this->request->data['User']['username']);
        }

        if ($this->request->is('post')) {

            // validate fields!
            $validate = '';
            if (empty($this->request->data['User']['email'])) {
                $validate = "email is required";
            } else if (!Validation::email($this->request->data['User']['email'])) {
                $validate = "Invalid email type";
            } else if (empty($this->request->data['User']['username'])) {
                $validate = "username is required";
            } else if (empty($this->request->data['User']['firstname'])) {
                $validate = "first name is required";
            } else if (empty($this->request->data['User']['lastname'])) {
                $validate = "last name is required";
            } else if (empty($this->request->data['User']['password'])) {
                $validate = "password is required";
            } else if (empty($this->request->data['User']['password_confirm'])) {
                $validate = "password confirmation is required";
            } else if (empty($this->request->data['User']['conditions'])) {
                $validate = "terms and conditions are required";
            } else if ($this->User->findByEmail($this->request->data['User']['email'])) {
                $validate = "email already exists";
            } else if ($this->User->findByUsername($this->request->data['User']['username'])) {
                $validate = "username already exists";
            }

            if (!empty($validate)) {
                $this->set(array(
                    'message' => array(
                        'text' => __($validate),
                        'type' => 'error'
                    ),
                    '_serialize' => array('message')
                ));
                $this->response->statusCode(404);
            }

            if ($this->request->data['User']['password'] === $this->request->data['User']['password_confirm']) {
                $this->User->create();
                $data = $this->request->data;
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

                    if ($this->Auth->login()) {

                        $this->User->id = $this->Auth->user('id');
                        $this->User->saveField('last_login', date('Y-m-d H:i:s') );
                        $findUser = $this->User->findById($this->Auth->user('id'));
                        $this->set(array(
                            'message' => array(
                                'text' => __('You are registered and logged!'),
                                'type' => 'success'
                            ),
                            'user' => array(
                                'id'            => $this->Auth->user('id'),
                                'username'      => $this->Auth->user('username'),
                                'profile_image' => $findUser['User']['profile_image'],
                                'theme'         => $findUser['User']['theme'],
                            ),
                            '_serialize' => array('message','user')
                        ));
                    } else {
                        $this->set(array(
                            'message' => array(
                                'text' => __('Registered! But can\'t logged in...'),
                                'type' => 'error'
                            ),
                            '_serialize' => array('message')
                        ));
                        $this->response->statusCode(401);
                    }
                    /*
                    $this->Auth->login($findUser['User']);
                    $this->redirect('/');
                    */
                }
            }
        }

        if (!$this->request->is('post')) {
            $this->redirect("/dashboard");
        }
    }

    public function setProfileImage(){

        if (!$this->Auth->user('id')) {
            $this->response->statusCode(401);
        } else {

            $path = "";
            
            if ($this->request->is('post')) {
                $path = $this->request->data['path'];

                $this->User->id = $this->Auth->user('id');
                $this->User->profile_image = $path;
                $this->User->saveField('profile_image', $path );
                $this->Session->write('Auth.User.profile_image', $path);

                Socialnet::setProfileImage($this->Auth->user('id'),$path);
            }

        }

        $this->layout = 'anonymous';
        $this->set(array(
            'path' => $path,
            '_serialize' => array('path')
        ));

    }

    public function setInformation(){

        if (!$this->Auth->user('id')) {
            $this->response->statusCode(401);
        }

        $this->layout = 'anonymous';
        $user = "";
        
        if ($this->request->is('post')) {
            $user = $this->request->data['user'];
            $this->User->id = $this->Auth->user('id');

            $this->User->set(array('User'=>$user));
            if ($this->User->validates(array_keys($user))) {
                $this->User->save();
                foreach ($user as $key => $value) {
                    $this->Session->write("Auth.User.{$key}", $value);
                }
                $user = $this->User->findById($this->User->id);
                unset($user['User']['password']);

                $this->set(array(
                    'user' => $user['User'],
                    '_serialize' => array('user')
                ));                    
            } else {

                $this->set(array(
                    'error' => array($this->User->validationErrors),
                    '_serialize' => array('error')
                ));
                $this->response->statusCode(401);
            }

        }

        if (!$this->request->is('post')) {
            $this->redirect("/dashboard");
        }

    }

    public function usersInSocialnet() {
        $external_id= isset($this->request->data['external_user_id'])   ? $this->request->data['external_user_id']  : '';
        $network    = isset($this->request->data['network'])            ? $this->request->data['network']           : '';

        $users = $this->User->find('all', array(
            'conditions'=> array(
                'User.status'=>"enabled",
                'Socialnet.network' => $network,
                'Socialnet.external_user_id' => $external_id
            ),
            'joins'     => array(
                array(
                    'table' => 'socialnets',
                    'alias' => 'Socialnet',
                    'type'  => 'INNER',
                    'conditions' => 'Socialnet.user_id = User.id'
                )
            ),
            'order'     => array('User.id' => 'desc'),
        ));

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

}