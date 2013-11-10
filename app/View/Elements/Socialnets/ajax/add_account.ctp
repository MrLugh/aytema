<?php
$data = str_replace('"', '\\"', json_encode($response_data));
$data = str_replace('\t', '', $data);
$data = str_replace('\n', '', $data);
echo "<script type='text/javascript'>window.opener.add_account('".$data."');self.close();</script>";
?>