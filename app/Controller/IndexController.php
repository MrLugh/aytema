<?php

class IndexController extends AppController {

    public function beforeFilter() {

		$this->Auth->allow('home');

    }

    public function home() {

    }

}