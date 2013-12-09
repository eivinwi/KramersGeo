<?php

require_once("ob_etag_handler.php");
ob_start("ob_etag_handler");
header("Access-Control-Allow-Origin: *");

$ch = curl_init();

function url_get_contents ($url) {
  global $ch;

  if (!$ch) {
    return null;
  }

  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_TIMEOUT, 3);

  if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $data = http_build_query($_POST);

    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  }

  $data = curl_exec($ch);
  return $data;
}

/*
 * DHIS Developer API has an invalid HTTPS certificate at time of writing.
 */
$username = rawurlencode($_SERVER['PHP_AUTH_USER']);
$password = rawurlencode($_SERVER['PHP_AUTH_PW']);

$base = "http://$username:$password@apps.dhis2.org/dev/api";
$ext  = substr($_SERVER['REQUEST_URI'], strlen($_SERVER['SCRIPT_NAME']));

header("Content-type: application/json");
echo url_get_contents($base . $ext);

curl_close($ch);
