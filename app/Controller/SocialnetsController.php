<?php

App::import('model','Socialnet');
App::import('Vendor', 'abstract', array('file' => 'collect_data/ds/content_hub/abstract.php'));

class SocialnetsController extends AppController {

    public $components = array('RequestHandler');

    public function beforeFilter() {

        $this->Auth->allow('index');

    }

    public function index() {

        $conditions = array();
        $status = isset($this->request->query['status']) ? $this->request->query['status'] : '';

        if (!empty($status)) {
            $conditions['Socialnet.status'] = $status;
        }

        $socialnets = $this->Socialnet->find('all',array(
            'conditions' => $conditions,
            'order'     => array('Socialnet.created' => 'desc'),
        ));
        foreach ($socialnets as $key => $socialnet) {
            $socialnets[$key]['Socialnet']['stats'] = json_decode($socialnet['Socialnet']['stats'],true);
        }

        $this->set(array(
            'socialnets' => $socialnets,
            '_serialize' => array('socialnets')
        ));

    }

    public function delete($id) {
        if ($this->Socialnet->delete($id)) {
            $message= 'ok';
        } else {
            $message= 'error';
        }
        $this->set(array(
            'message'   => $message,
            '_serialize'=> array('message')
        ));
    }    

}

?>