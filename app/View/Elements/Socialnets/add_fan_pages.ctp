<?php
$data = str_replace('"', '\\"', json_encode($response_data));
$data = str_replace('\t', '', $data);
$data = str_replace('\n', '', $data);
//echo "<script type='text/javascript'>window.parent.add_facebook_fanpages('".$data."');</script>";
echo "<script type='text/javascript'>self.close();</script>";
?>