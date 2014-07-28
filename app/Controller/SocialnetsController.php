<?php

App::import('Vendor', 'abstract', array('file' => 'collect_data/ds/content_hub/abstract.php'));
App::import('model','User');
App::import('model','Socialnet');

class SocialnetsController extends AppController {

    public $components = array('RequestHandler');

    public function beforeFilter() {

        $this->Auth->allow('index');
        $this->loadModel('User');
    }

    public function index() {

        $conditions = array();
        $status     = isset($this->request->data['status'])    ? $this->request->data['status']   : '';
        $username   = isset($this->request->data['username'])  ? $this->request->data['username'] : NULL;
        $search     = isset($this->request->data['search'])    ? $this->request->data['search']   : NULL;
        $networks   = isset($this->request->data['networks'])  ? $this->request->data['networks'] : NULL;
        $external_id= isset($this->request->data['external_user_id'])  ? $this->request->data['external_user_id'] : NULL;
        isset($this->request->data['offset']) ? $offset= $this->request->data['offset']   : $offset   = 0;
        isset($this->request->data['limit'])  ? $limit = $this->request->data['limit']    : $limit    = 10;

        $findUser = $this->User->findByUsername($username);
        if (!empty($findUser)) {
            $conditions['Socialnet.user_id'] = $findUser['User']['id'];
        }

        if (!empty($status)) {
            $conditions['Socialnet.status'] = $status;
        }

        if (!empty($external_id)) {
            $conditions['Socialnet.external_user_id'] = $external_id;
        }        

        if (!empty($search)) {
            $conditions['or'] = array(
                "Socialnet.network LIKE " => "%{$search}%",
                "Socialnet.login LIKE " => "%{$search}%",
            );
        }

        if (!empty($networks)) {
            $conditions['Socialnet.network'] = $networks;
        }

        $socialnets = $this->Socialnet->find('all',array(
            'conditions'=> $conditions,
            'limit'     => $limit,
            'offset'    => $offset,            
            'order'     => array('Socialnet.id' => 'desc'),
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