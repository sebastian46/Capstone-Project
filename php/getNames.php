<?php
/*
	What:
		This file is for getting sensor names (for graphs and tabs)
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

// gets names for every sensor, stores in array and returns the array (data in JSON format)
$query = mysqli_query($con, "SELECT name FROM inputsettings");

$data = array();
while ($row = mysqli_fetch_object($query))
{
    array_push($data, $row);
}

echo json_encode($data);
exit();
?>