<?php

/* ONLY FOR TEST  */
App::import('Vendor', 'CollectData', array('file' => 'collect_data/collect_data.php'));
App::import('model','Socialnet');
App::import('model','Content');

class ContentsController extends AppController {

    public $components = array('RequestHandler');

    public function beforeFilter() {

        $this->Auth->allow('index','view','relateds');
        $this->loadModel('Socialnet');
    }    

    public function index() {

        $params = array();

        isset($this->request->query['accounts']) ? $accounts = $this->request->query['accounts'] : $accounts = null;
        isset($this->request->query['networks']) ? $selected_networks = $this->request->query['networks'] : $selected_networks = null;
        isset($this->request->query['concepts']) ? $selected_types = $this->request->query['concepts'] : $selected_types = null;
        isset($this->request->query['offset']) ? $offset= $this->request->query['offset']   : $offset   = 0;
        isset($this->request->query['limit'])  ? $limit = $this->request->query['limit']    : $limit    = 10;

        $params['Content.status'] = 'enabled';

        if (!empty($accounts)) {
            $socialnets = $this->Socialnet->find('all', array(
                'conditions'=> array('Socialnet.id'=>$accounts),
                )
            );
            foreach ($socialnets as $key => $account) {
                $params['OR'][] = array(
                    'Content.network'=>$account['Socialnet']['network'],
                    'Content.external_user_id'=> $account['Socialnet']['external_user_id']
                );
            }
        }

        if (count($selected_networks)) {
            $params['Content.network'] = $selected_networks;
        }

        //TEST
        //$params['Content.network'] = array('youtube'=>'youtube');

        if (count($selected_types)) {
            $params['Content.concept'] = $selected_types;
        }

        //TEST
        //$params['Content.concept'] = array('photo'=>'photo');

        $contents = $this->Content->find('all', array(
            'conditions'=> $params,
            'order'     => array('Content.creation_date' => 'desc'),
            'limit'     => $limit,
            'offset'    => $offset,
            )
        );

        foreach ($contents as $key => $content) {
            $contents[$key]['Content']['data'] = unserialize($content['Content']['data']);
            $contents[$key]['Content']['stats']= unserialize($content['Content']['stats']);
        }

        $this->set(array(
            'contents'  => $contents,
            '_serialize'=> array('contents')
        ));

    }

    public function delete() {

        isset($this->request->query['id']) ? $id = $this->request->query['id'] : $id = null;

        $content = $this->Content->findById($id);

        if (is_array($content) && isset($content['Content'])) {
            $save = $content['Content'];
            $save['status'] = 'disabled';
            $content = new Content();
            $content = $content->save($save);            
            $message = 'Deleted';
        } else {
            $message = 'Error';
        }

        $this->set(array(
            'message' => $message,
            '_serialize' => array('message')
        ));
    }

    public function activate() {

        isset($this->request->query['id']) ? $id = $this->request->query['id'] : $id = null;

        $content = $this->Content->findById($id);

        if (is_array($content) && isset($content['Content'])) {
            $save = $content['Content'];
            $save['status'] = 'enabled';
            $content = new Content();
            $content = $content->save($save);            
            $message = 'Activated';
        } else {
            $message = 'Error';
        }

        $this->set(array(
            'message' => $message,
            '_serialize' => array('message')
        ));
    }        

    public function collect() {

        $user_id = $this->Auth->user('id');
        
        $network = isset($this->request->query['network'])    ? $this->request->query['network']   : null;

        $params = array();

        if ($network) {
            $params['network'] = $network;
        }

        if (isset($this->request->query['account_id'])) {
            $params['account_id'] = $this->request->query['account_id'];
        }

        $collect= new CollectData($params);
        $data   = $collect->collect();

        foreach ($data as $key => $value) {

            $value['data']  = serialize($value['data']);
            $value['stats'] = serialize($value['stats']);

            $content = $this->Content->find('all', array(
                'conditions' => array(
                    'Content.network'         => $value['network'],
                    'Content.concept'         => $value['concept'],
                    'Content.external_user_id'=> $value['external_user_id'],
                    'Content.external_id'     => $value['external_id'],
                    ),
                'fields'    => array('Content.id'),
                )
            );

            $save = $value;
            if (count($content)) {
                $update                 = array_shift($content);
                $save['id']             = $update['Content']['id'];
                $save['updated_date']   = date("Y-m-d H:i:s");
            }

            $new = new Content();
            $new = $new->save($save);
        }

        $this->redirect(array('controller' => 'index', 'action' => 'home'));

    }    

    public function relateds() {

        $params = array();

        isset($this->request->query['id']) ? $id = $this->request->query['id'] : $id = null;
        isset($this->request->query['network']) ? $network = $this->request->query['network'] : $network = null;
        isset($this->request->query['concept']) ? $concept = $this->request->query['concept'] : $concept = null;
        isset($this->request->query['external_user_id']) ? $external_user_id = $this->request->query['external_user_id'] : $external_user_id = null;
        isset($this->request->query['offset']) ? $offset= $this->request->query['offset']   : $offset   = 0;
        isset($this->request->query['limit'])  ? $limit = $this->request->query['limit']    : $limit    = 10;

        $params['Content.status'] = 'enabled';

        if (!empty($id)) {
            $params['Content.id !='] = $id;
        }

        if (count($network)) {
            $params['Content.network'] = $network;
        }

        if (count($concept)) {
            $params['Content.concept'] = $concept;
        }

        if (count($external_user_id)) {
            $params['Content.external_user_id'] = $external_user_id;
        }

        $contents = $this->Content->find('all', array(
            'conditions'=> $params,
            'order'     => array('Content.creation_date' => 'desc'),
            'limit'     => $limit,
            'offset'    => $offset,
            )
        );

        foreach ($contents as $key => $content) {
            $contents[$key]['Content']['data'] = unserialize($content['Content']['data']);
            $contents[$key]['Content']['stats']= unserialize($content['Content']['stats']);
        }

        $this->set(array(
            'contents'  => $contents,
            '_serialize'=> array('contents')
        ));

    }

    public function add() {

        $content = $this->request->data['content'];
        $content['external_user_id']    = $this->Auth->user('id');
        $content['external_user_name']  = $this->Auth->user('username');
        $content['creation_date']       = date("Y-m-d H:i:s");
        $content['data']                = serialize($content['data']);
        $new = new Content();
        $new = $new->save($content);
        $new['Content']['external_id']          = $new['Content']['id'];
        $new['Content']['external_atomic_id']   = $new['Content']['id'];
        $content = new Content();
        $new = $content->save($new['Content']);
        $new['Content']['data']                 = unserialize($new['Content']['data']);
        $this->set(array(
            'content'  => $new,
            '_serialize'=> array('content')
        ));        
    }

}

?>