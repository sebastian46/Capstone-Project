<?php
/* 
	What it does:
		This file lets the user update settings from the settings page.
	How: 
		Takes in input from user, checks if any fields were blank (except id), and 
		updates them with query.
*/
// settings
$id=$_POST['t1'];
$name=$_POST['t2'];
$min=$_POST['t3'];
$max=$_POST['t4'];
$alarm=$_POST['t5'];
$units=$_POST['t6'];


// connect to database
$host="localhost";
$port=3306;
$socket="";
$user="root";
$password="";
$dbname="test";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());


// check current settings for that id
// purpose is to keep old settings if user leaves field blank
$query = mysqli_query($con, "SELECT * FROM inputsettings WHERE id='$id'");

$data = array();
while ($row = mysqli_fetch_object($query))
{
    $tid=$row->id;
    $tname=$row->name; 
    $tmin=$row->min; 
    $tmax=$row->max;
    $talarm=$row->alarm; 
    $tunits=$row->units;
}

if(empty($id))
	$id=$tid;
if(empty($name))
	$name=$tname;
if(empty($min))
	$min=$tmin;
if(empty($max))
	$max=$tmax;
if(empty($alarm))
	$alarm=$talarm;
if(empty($units))
	$units=$tunits;

// update settings
mysqli_query($con, "UPDATE inputsettings 
					SET id='$id', name='$name', min='$min', max='$max', alarm='$alarm', units='$units'
					WHERE id='$id'");

header("Location: ../settings.html");

?>