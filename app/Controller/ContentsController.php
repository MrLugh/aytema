<?php

/* ONLY FOR TEST  */
App::import('Vendor', 'CollectData', array('file' => 'collect_data/collect_data.php'));

class ContentsController extends AppController {

    public $components = array('RequestHandler');

    public function beforeFilter() {

        $this->Auth->allow('index');
    }    

    public function index() {

        $params = array();

        $user_id = $this->Auth->user('id');

        isset($this->request->query['networks']) ? $selected_networks = $this->request->query['networks'] : $selected_networks = null;
        isset($this->request->query['content_types']) ? $selected_types = $this->request->query['content_types'] : $selected_types = null;
        isset($this->request->query['offset']) ? $offset= $this->request->query['offset']   : $offset   = 0;
        isset($this->request->query['limit'])  ? $limit = $this->request->query['limit']    : $limit    = 10;

        $params['Content.status'] = 'enabled';

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

        $content = $this->Content->findById($id+1000);

        if (count($content) && isset($content['content'])) {

            $content['Content']['status'] = 'disabled';
            $update = new Socialnet();
            $update = $update->save($content['Content']);
            $message = 'Deleted';
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

}

?>