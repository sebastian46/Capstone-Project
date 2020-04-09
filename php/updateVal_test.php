<?php
/*
	What:
		This file is for TESTING mainly. It updates sensor values, which is
		not necessary for my part; it also returns the whole values table.
	How:
		sql queries
*/
header('Access-Control-Allow-Origin: *');

// connect to database
$host="localhost";
$port=3306;
$socket="";
$user="root";
$password="";
$dbname="test";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

// update value column with random values from 0-10 every 2 seconds (600 second timeout)
$x = 1;
for($x = 1; $x <=300; $x++){
	mysqli_query($con, "UPDATE storeval SET value = RAND()*(10)");
	sleep(2);
}

?>