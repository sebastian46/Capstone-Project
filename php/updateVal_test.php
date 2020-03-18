<?php
/*
	What:
		This file is for testing mainly. It updates sensor values, which is
		not necessary for my part; it also returns the whole values table.
	How:
		sql queries
*/
header('Access-Control-Allow-Origin: *');

$host="localhost";
$port=3306;
$socket="";
$user="root";
$password="";
$dbname="test";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

//$con->close();

// update value column with random values from 0-10
$x = 1;
for($x = 1; $x <=100; $x++){
	mysqli_query($con, "UPDATE storeval SET value = RAND()*(10)");
	sleep(12);
}

?>