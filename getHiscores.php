<?php
$return = true;

require('connectDB.php');

$query = "SELECT * FROM `$db`.`hiscores` ORDER BY `score` DESC LIMIT 5";
$result = mysql_query($query, $link) or die ($return = false);

if($return === false)
{
	echo "false";
	exit();
}

$return = "[";

while($row = mysql_fetch_object($result))
{
	$i++;
		
	$return .= "{'meno': '$row->meno', 'score': '$row->score'}, ";
}

if($i)
{
	$return = substr($return, 0, strlen($return) - 2) . "]";
}
else
{
	$return = "false";
}

echo $return;

?>