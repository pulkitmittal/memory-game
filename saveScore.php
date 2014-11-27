<?php

function post($key) {
    if (isset($_POST[$key]))
        return $_POST[$key];
    return false;
}

include 'connect.php';

// check if we can get hold of the form field
if (!post('obj')) {
    exit();
}

$obj = post('obj');

// let make sure we escape the data
$obj = mysqli_real_escape_string($mysqli, $obj);

$json_decoded = json_decode(stripslashes($obj));

$userid = $json_decoded->{'userid'};
$user = $json_decoded->{'user'};
$email = $json_decoded->{'email'};
$score = $json_decoded->{'score'};
$moves = $json_decoded->{'moves'};
$time = $json_decoded->{'time'};

if($userid == 0) {
    $query = "INSERT INTO player (name, email) VALUES ('$user', '$email')";
	$mysqli->query($query);
	$userid = $mysqli->insert_id;
}

$query = "INSERT INTO game (userid, score, time, moves, timestamp) VALUES ($userid, $score, $time, $moves, now())";
$mysqli->query($query);
$id = $mysqli->insert_id;

// setup our response "object"
$resp = new stdClass();
$resp->success = false;
if($id>0) {
    $resp->success = true;
    $resp->userid = $userid;
    $resp->name = $user;
    $resp->email = $email;
}

print json_encode($resp);
?>