<?php

class ThemesController extends AppController {

    public function beforeFilter() {

		$this->Auth->allow('index');

    }


    public function index() {

        $this->layout = "/themes/digest/index";
    }

}