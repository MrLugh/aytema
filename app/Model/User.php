<?php


Class User extends AppModel {

	public static $default_image = 'http://cloudcial.com/img/avatar.png';

	public $validate = array(
		'email' => array(
			'kosher' => array(
				'rule' => 'email',
				'message' => 'Please make sure your email is entered correctly.'
			),
			'unique' => array(
				'rule' => 'isUnique',
				'message' => 'An account with that email already exists.'
			),
			'required' => array(
				'rule' => 'notEmpty',
				'message' => 'Please Enter your email.'
			)
		),
		'username' => array(
			'unique' => array(
				'rule' => 'isUnique',
				'message' => 'An account with that username already exists.'
			),
			'required' => array(
				'rule' => 'notEmpty',
				'message' => 'Please Enter your username.'
			)
		),		
		'password' => array(
			'min' => array(
				'rule' => array('minLength', 6),
				'message' => 'Password must be at least 6 characters.'
			),
			'required' => array(
				'rule' => 'notEmpty',
				'message'=>'Please enter a password.'
			),
		),
		'password_confirm' => array(
			'required'=>'notEmpty',
			'match'=>array(
				'rule' => 'validatepasswordConfirm',
				'message' => 'Passwords do not match'
			)
		),
		'firstname' => array(
			'required' => array(
				'rule' => 'notEmpty',
				'message'=>'Please enter your first name.'
			),
			'max' => array(
				'rule' => array('maxLength', 50),
				'message' => 'First name must be fewer than 50 characters'
			)
		),
		'lastname' => array(
			'required' => array(
				'rule' => 'notEmpty',
				'message' => 'Please enter your last name.'
			),
			'max' => array(
				'rule' => array('maxLength', 50),
				'message' => 'Last name must be fewer than 50 characters'
			)
		)
	);

	public function validatepasswordConfirm($data) {

		if ($this->data['User']['password'] !== $data['password_confirm']) {
			return false;
		}
	
		return true;

	}

	public function beforeSave($options = array()) {

		if (isset($this->data['User']['password'])) {
			$this->data['User']['password'] = Security::hash($this->data['User']['password'], null, true);
		}

		if (isset($this->data['User']['password_confirm'])) {
			unset($this->data['User']['password_confirm']);
		}

		return true;
	}

}