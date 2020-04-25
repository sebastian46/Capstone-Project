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

// returns the settings for each sensor in JSON format
$query = mysqli_query($con, "SELECT min, max, High_Alarm, units, decimal_places, Low_Alarm FROM inputsettings");

$data = array();
while ($row = mysqli_fetch_object($query))
{
    array_push($data, $row);
}

echo json_encode($data);
exit();
?>