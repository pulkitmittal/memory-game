<?php

// setup the database connect
$mysqli = mysqli_connect('localhost', 'root', '', "colour_memory");
if (mysqli_connect_errno($mysqli)) {
	printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

?>