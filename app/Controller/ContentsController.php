<?php

/* ONLY FOR TEST  */
App::import('Vendor', 'CollectData', array('file' => 'collect_data/collect_data.php'));
App::import('model','Socialnet');
App::import('model','Content');
App::import('model','User');

class ContentsController extends AppController {

    public $components = array('RequestHandler');

    public function beforeFilter() {

        $this->Auth->allow('index','view','relateds','addFile');
        $this->loadModel('Socialnet');
        $this->loadModel('User');
    }

    public function index() {

        $params = array();

        isset($this->request->query['accounts']) ? $accounts = $this->request->query['accounts'] : $accounts = null;
        isset($this->request->query['networks']) ? $selected_networks = $this->request->query['networks'] : $selected_networks = null;
        isset($this->request->query['concepts']) ? $selected_types = $this->request->query['concepts'] : $selected_types = null;
        isset($this->request->query['offset']) ? $offset= $this->request->query['offset']   : $offset   = 0;
        isset($this->request->query['limit'])  ? $limit = $this->request->query['limit']    : $limit    = 10;
        isset($this->request->query['username']) ? $username = $this->request->query['username'] : $username = null;

        $findUser = $this->User->findByUsername($username);

        $params['Content.status'] = 'enabled';

        if (!empty($accounts)) {

            $conditions = array('Socialnet.id'=>$accounts);
            if (!empty($findUser)) {
                $conditions['Socialnet.user_id'] = $findUser['User']['id'];
            }

            $socialnets = $this->Socialnet->find('all', array('conditions'=> $conditions));
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

            $status = 'enabled';
            if ($value['network'] == 'soundcloud' && $value['data']['sharing'] != 'public') {
                $status = 'disabled';
            }

            $value['status']= $status;
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

        $this->redirect(array('controller' => 'index', 'action' => 'dashboard'));

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

        $this->Socialnet->updateTotalStats($this->Auth->user('id'),'cloudcial');

        $this->set(array(
            'content'  => $new,
            '_serialize'=> array('content')
        ));
    }

    public function update() {

        $content = $this->request->data['content'];
        $content['data'] = serialize($content['data']);

        if ($this->Auth->user('id') == $content['external_user_id']) {
            $new = new Content();
            $new = $new->save($content);
            $new['Content']['data'] = unserialize($new['Content']['data']);
            $this->set(array(
                'content'  => $new,
                '_serialize'=> array('content')
            ));
        } else {
            throw new Exception("Error Processing Request", 1);
        }

        

    }


    /* Upload Files Functions */

    private function getFileType() {
        if (empty($_FILES) || !isset($_FILES['file']['type'])) {
            return null;
        }
        if (preg_match("/\bimage\b/i",$_FILES['file']['type'])) {
            return 'photo';
        }
        if (preg_match("/\baudio\b/i",$_FILES['file']['type'])) {
            return 'track';
        }
        if (preg_match("/\bvideo\b/i",$_FILES['file']['type'])) {
            return 'video';
        }
    }

    private function mimeTypesByFile($type) {
        if ($type == 'photo') {
            return array("image/gif", "image/jpeg", "image/png");
        }
        if ($type == 'track') {
            return array(
                "audio/mpeg",
                "audio/mp3",
                "audio/mp4",
                "audio/ogg",
                "audio/wav",
                "audio/webm",
                "audio/aac"
            );
        }

        if ($type == 'video') {
            return array(
                "video/mp4",
                "video/m4v",
                "video/ogg",
                "video/ogv",
                "video/webm"
            );
        }
    }

    public function checkPath($uploadPath) {
        if(!is_dir($uploadPath)) {
            $oldumask = umask(0);
            mkdir($uploadPath, 0777, true);
            umask($oldumask);
        }        
    }

    public function addFile() {

        $user_id = $this->Auth->user('id');

        if ($this->request->is('post')) {

            if (!empty($_FILES)) {

                $concept = $this->getFileType();

                $fileTypes = $this->mimeTypesByFile($concept);

                $uploadPath = WWW_ROOT . "files/users/{$user_id}/{$concept}";

                $this->checkPath($uploadPath);

                foreach ($fileTypes as $key => $type) {

                    if ( $_FILES['file']['type'] ==  $type ) {

                        if ($_FILES['file']['error'] == 0) {

                            $fileName = date("Y-m-d") . "_" . $_FILES['file']['name'];

                            $this->checkPath($uploadPath);
                            $full_path = $uploadPath . '/' . $fileName;

                            if (move_uploaded_file($_FILES['file']['tmp_name'], $full_path)) {
                                
                                $data = array(
                                    'path'  => "/files/users/{$user_id}/{$concept}/{$fileName}",
                                    'mime'  => $_FILES['file']['type']
                                );

                                $this->set(array(
                                    'data'  => $data,
                                    '_serialize'=> array('data')
                                ));

                            } else {


                                $this->set(array(
                                    'error'  => 'There was a problem uploading file. Please try again.',
                                    '_serialize'=> array('error')
                                ));

                            }

                        } else {
                            $this->set(array(
                                'error'  => 'Error uploading file.',
                                '_serialize'=> array('error')
                            ));
                        }
                    }
                }
            }/* else {
                $this->set(array(
                    'error'  => 'File not uploaded.',
                    '_serialize'=> array('error')
                ));
            }*/
        }

    }

    public function deleteFile() {
        $path = str_replace("//", "/", WWW_ROOT . $this->request->data['path']);
        unlink($path);
        var_dump(expression);
        $this->set(array(
            'status'  => "ok",
            '_serialize'=> array('status')
        ));    
    }

}

?>