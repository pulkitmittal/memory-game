<?php

// setup the database connect
$mysqli = mysqli_connect('mysql.grendelhosting.com', 'u582717137_color', 'admin123', "u582717137_color");
if (mysqli_connect_errno($mysqli)) {
	printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

?>