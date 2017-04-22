<?php

require('connectDB.php');

if(isset($_GET['score'], $_GET['meno']))
{
	$meno = substr($_GET['meno'], 0, 15);
	$score = min($_GET['score'], 9999);
	
	$query = "SELECT * FROM `$db`.`hiscores` ORDER BY `score` DESC";
	$result = mysql_query($query, $link);
	
	$i = 0;
	$id = 0;
	while($row = mysql_fetch_object($result))
	{
		$i++;
		$id = $row->id;
	}
	echo $id;
	if($i == 5)
		$query = "UPDATE `$db`.`hiscores` SET `meno` = '$meno', `score` = '$score' WHERE `id` = '$id'";
	else
		$query = "INSERT INTO `$db`.`hiscores` (`id`, `meno`, `score`) VALUES ('$i', '$meno', '$score')";
	$result = mysql_query($query, $link);
}

?>