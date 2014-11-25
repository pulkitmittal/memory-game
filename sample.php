<html>

<body>



<?php
$mysqli = mysqli_connect("localhost", "root", "", "colour_memory");
if (mysqli_connect_errno($mysqli)) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
echo $mysqli->host_info . "\n";
?>



</body>

</html>