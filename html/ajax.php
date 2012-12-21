<?php
$lang = $_GET["lenguaje"]?$_GET["lenguaje"]:"php";
switch ($lang) {
	case 'php':
		$var = shell_exec('php -e ../astar.php');
		break;
	case "python":
		$var = shell_exec('python ../astar.py');
		break;
	case "js":
		$var = shell_exec('node ../astar.js');
		break;
	case "java":
		$var = shell_exec('java -cp ../java/astar.jar Main');
		break;
}

print $var;