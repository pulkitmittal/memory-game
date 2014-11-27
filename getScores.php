<?php

// setup the database connect
$mysqli = mysqli_connect('localhost', 'root', '', "colour_memory");
if (mysqli_connect_errno($mysqli)) {
	printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$resp = new stdClass();

$query = "select s.* from (select p.id, p.name, p.email, g.score, g.moves, g.time, g.timestamp from player p, game g 
where p.id = g.userid order by g.score desc, g.time desc) as s group by s.id order by s.score desc, s.time desc";
if($result = $mysqli->query($query)) {
    
    $list = array();
    while($obj = $result->fetch_object()){
        array_push($list, $obj); 
    } 

    $resp->success = true;
    $resp->rows = $list;
    /* free result set */
    $result->close();
} else {
    $resp->success = false;
}

print json_encode($resp);
?>