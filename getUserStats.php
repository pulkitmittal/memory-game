<?php

// setup the database connect
$mysqli = mysqli_connect('localhost', 'root', '', "colour_memory");
if (mysqli_connect_errno($mysqli)) {
	printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$resp = new stdClass();

$query = "SELECT count(*), max(score) FROM game where userid = ".$_GET['userid'];
if($result = $mysqli->query($query)) {
    
    /* fetch object array */
    $obj = new stdClass();
    while ($row = $result->fetch_row()) {
        $obj->count = $row[0];
        $obj->max = $row[1];
    }

    $resp->success = true;
    $resp->obj = $obj;
    /* free result set */
    $result->close();
} else {
    $resp->success = false;
}

print json_encode($resp);
?>