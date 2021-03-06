<?php
/* 
	What it does:
		This file lets the user update settings from the settings page.
	How: 
		Takes in input from user, checks if any fields were blank (except id), and 
		updates them with query.
*/
// settings sent by user
$id=$_POST['t1'];
$name=$_POST['t2'];
$min=$_POST['t3'];
$max=$_POST['t4'];
$low_alarm=$_POST['t5'];
$units=$_POST['t6'];
$decimals=$_POST['t7'];
$high_alarm=$_POST['t8'];


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
    $thighalarm=$row->High_Alarm;
    $tunits=$row->units;
    $tdecimals=$row->decimal_places;
    $tlowalarm=$row->Low_Alarm; 
}
// if a field is left blank, keep old value
if(empty($id))
	$id=$tid;
if(empty($name))
	$name=$tname;
if(empty($min))
	$min=$tmin;
if(empty($max))
	$max=$tmax;
if(empty($low_alarm))
	$low_alarm=$tlowalarm;
if(empty($units))
	$units=$tunits;
if(empty($decimals))
	$decimals=$tdecimals;
if(empty($high_alarm))
	$high_alarm=$thighalarm;
// update settings
mysqli_query($con, "UPDATE inputsettings 
					SET id='$id', name='$name', min='$min', max='$max', High_Alarm='$high_alarm', units='$units', decimal_places='$decimals', Low_Alarm='$low_alarm'
					WHERE id='$id'");

echo "Settings Updated";
?>