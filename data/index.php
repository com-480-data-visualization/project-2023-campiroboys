<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$json_file = file_get_contents('./stadtkreise_a.json');
echo $json_file;
