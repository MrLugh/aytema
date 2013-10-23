<?php

class UsersController extends AppController {

    public function beforeFilter() {

		$this->Auth->allow('register');

    	$this->Auth->fields = array(
    		'username'			=> 'username',
    		'password'			=> 'secretword',
    	);
    }

    public function login() {

		if ($this->request->is('post')) {

		    if ($this->Auth->login()) {
		    	$this->User->id = $this->Auth->user('id');
            	$this->User->saveField('last_login', date('Y-m-d H:i:s') );
                die("Logged");
		    }
		}
        throw new ForbiddenException("You are not authorized to access that location.");
        
    }

    public function logout() {

        $this->redirect($this->Auth->logout());
    }

	public function register() {

		if (isset($this->request->data['User']['username'])) {
			$this->request->data['User']['username'] = strtolower($this->request->data['User']['username']);
		}

    	if ($this->data &&
            isset($this->data['User']['password']) &&
            isset($this->data['User']['password'])) {

        	if ($this->data['User']['password'] === $this->data['User']['password_confirm']) {
	            $this->User->create();
            	if($this->User->save($this->data)) {
            		$this->redirect('/');
            	}
            }
    	}
	}

}