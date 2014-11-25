<?php

function post($key) {
    if (isset($_POST[$key]))
        return $_POST[$key];
    return false;
}

// setup the database connect
$mysqli = mysqli_connect('localhost', 'root', '', "colour_memory");
if (mysqli_connect_errno($mysqli)) {
	printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

// check if we can get hold of the form field
if (!post('obj')) {
    exit();
}

$obj = post('obj');

// let make sure we escape the data
$obj = mysqli_real_escape_string($mysqli, $obj);

printf ($obj);
$json_decoded = json_decode($obj);
printf ($json_decoded);
$userid = $json_decoded->{'userid'};
$user = $json_decoded->{'user'};
$email = $json_decoded->{'email'};

if($userid == 0) {
	$query = "INSERT INTO player (name, email) VALUES ('$user', '$email')";
	$mysqli->query($query);
	$userid = $mysqli->insert_id;
	printf ("New Record has id %d.\n", $userid);
}

// setup our response "object"
$resp = new stdClass();
$resp->success = false;
if($userid>0) {
    $resp->success = true;
}

print json_encode($resp);
?>