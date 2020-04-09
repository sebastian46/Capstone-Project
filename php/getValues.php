<?php
/*
	What:
		It sends sensor values to file
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

// returns values for sensors in JSON format
$query = mysqli_query($con, "SELECT value FROM storeval");

$data = array();
while ($row = mysqli_fetch_object($query))
{
    array_push($data, $row);
}

echo json_encode($data);
exit();

?>