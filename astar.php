<?php
/**
 * Implementación Astar tp caece.
 * Requiere PHP >= 5.4.0
 *
 * 200 = Transitable
 * 42 = obstaculo
 * 15 = fin del mapa
 * mide "11x20"
 **/
$mapa = array(
    200,200,200,200,200,200,200,200,200,200,15, // 0
	  200,200,200,200,200,200,200,200,200,200,15,  // 1
	  200,200,200,200,200,200,200,200,200,200,15,  // 2
	  200,200,200,200,200,200,200,200,200,200,15,  // 3
	  200,200,200,200,200,200,200,200,200,200,15,  // 4
	  200,200,200,200,200,200,200,200,200,200,15,  // 5
	  200,200,200,200,200,200,200,200,200,200,15,  // 6
	  200,200,200,200,200,200,200,200,200,200,15,  // 7
	  200,200,042,042,042,042,042,042,042,042,15,  // 8
	  200,200,200,200,200,200,200,200,200,200,15,  // 9
	  200,200,200,200,200,200,200,200,200,200,15,  // 10
	  200,200,200,200,200,200,200,200,200,200,15,  // 11
	  200,200,200,200,200,200,200,200,200,200,15,  // 12
	  200,200,200,200,200,042,042,042,042,042,15,  // 13
	  200,200,200,200,200,042,200,200,200,200,15,  // 14
	  200,200,200,200,200,042,200,042,200,200,15,  // 15
	  200,200,200,200,200,042,042,042,200,200,15,  // 16
	  200,200,200,200,200,200,200,200,200,200,15,  // 17
	  200,200,200,200,200,200,200,200,200,200,15,  // 18
	  200,200,200,200,200,200,200,200,200,200,15);  //19

$recorrido = array(
		array(4,5),
		array(3,6),
		array(2,7),
		array(1,8), 
		array(2,9),
		array(3,10),
		array(4,11),
		array(5,12),
		array(4,13),
		array(4,14),
		array(4,15),
		array(4,16),
		array(5,17),
		array(6,17),
		array(7,17),
		array(8,16),
		array(8,15),
		array(7,14),
		array(6,15),
	);




$output = aStar($mapa, 4, 5, 6, 15);

if($output != $recorrido) {
  echo "No devuelve el recorrido correcto." . PHP_EOL;
} else {
  echo "Devuelve el camino correcto." . PHP_EOL;
}



function getPixel($mapa, $cx, $cy) {
  if(array_key_exists($cy*11 + $cx, $mapa) && $mapa[$cy*11 + $cx] == 200) { 
    return true; 
  } else { 
    return false; 
  }
}

function esTransitable($mapa, $x, $y) {
  return getPixel($mapa, $x, $y);
}

function estaEn($lista, $x, $y) {
  $encontrado = 0;
  for($j=0; $j<count($lista); $j++) {
    if( ($lista[$j]["x"] == $x) && ($lista[$j]["y"] == $y) ) {
        $encontrado = $j + 1;
    }
  }
  return $encontrado;
}

function obtenerG($indice) {
    if( ($indice === 0 ) || ($indice === 1 ) || ($indice === 2 ) ||($indice === 3 ) ) { return 10; } else { return 14; }
}

function obtenerF($nodo) {
    return $nodo["g"] + $nodo["h"];
}

function popMinCostNode(&$lista) {
    $F = 0;
    $indiceMenorF = 0;
    $minCostoF = 100000;
    
    for($i = 0; $i<count($lista); $i++) {
		  $F = obtenerF($lista[$i]);
		  if($F < $minCostoF) {
			  $minCostoF = $F;
			  $indiceMenorF = $i;
		  }
    }
    
    $sustraccion = array_splice($lista, $indiceMenorF, 1);
    
    return $sustraccion[0];
  
} // end nodoAnalizadoMenorCosto


function obtenerH($x, $y, $fx, $fy) {
	return 10 * (abs($x - $fx) + abs($y - $fy));
}



/**
 *    Array   $map mapa donde se recorre todo
 *    Integer $x coordenada x de entrada
 *    Integer $y coordenada y de entrada
 *    Integer $fx coordenada x de llegada
 *    Integer $fy coordenada y de llegada
**/ 
function aStar($mapa, $x,$y,$fx,$fy){
	$nodoActual = 
	$listaCerrada = array();
  //Cargamos el primer nodo, desde donde parte. no tiene parent ni g ni h.
	$listaAbierta = array(
	  array("x" => $x, "y" => $y, "px" => -1, "py" => -1, "g" => 0, "h" => 0)
	);
	$camino = array();
	$adyacente = array(
	  array("x" =>  0, "y" => -1),
	  array("x" => -1, "y" =>  0),
	  array("x" =>  0, "y" =>  1),
	  array("x" =>  1, "y" =>  0),
	  array("x" => -1, "y" => -1),
	  array("x" =>  1, "y" =>  1),
	  array("x" =>  1, "y" => -1),
	  array("x" => -1, "y" =>  1)
  );

	$caminoEncontrado = false;

	while ((count($listaAbierta) !== 0) && (!$caminoEncontrado)) {

		$nodoAnalizado = popMinCostNode($listaAbierta);

		if (($nodoAnalizado["x"] == $fx) && ($nodoAnalizado["y"] == $fy)) {
			$caminoEncontrado = true;
		} else {
			for($i=0; $i<8; $i++) {//8 es la cantidad de nodos adjacentes.
				$ax = $nodoAnalizado["x"] + $adyacente[$i]["x"];
				$ay = $nodoAnalizado["y"] + $adyacente[$i]["y"];

				if (esTransitable($mapa, $ax, $ay)) {
					$indexOpen = estaEn($listaAbierta,$ax,$ay);
					$indexClose = estaEn($listaCerrada,$ax,$ay);

					if (($indexOpen == 0) && ($indexClose == 0)) {
						// no esta en ninguna lista asi que lo agrego en listaAbierta
						$G = $nodoAnalizado["g"] + obtenerG($i);
						$H = obtenerH($ax,$ay,$fx,$fy);
						$nodoTemp = array("x" => $ax, "y" => $ay, "px" => $nodoAnalizado["x"], "py" => $nodoAnalizado["y"], "g" => $G, "h" => $H);
						
						$listaAbierta[] =  $nodoTemp;
					}
				} // si es transitable.
			} // END FOR
		} // fin analisis de nodos
		$listaCerrada[] = $nodoAnalizado;
	} // fin while
	  
	if(count($listaAbierta) === 0) {
		return false;
	} else {
		$indiceFinal = count($listaCerrada) - 1;
		array_push($camino, array($listaCerrada[$indiceFinal]["x"], $listaCerrada[$indiceFinal]["y"]));
		$parentX = $listaCerrada[$indiceFinal]["px"];
		$parentY = $listaCerrada[$indiceFinal]["py"];

		while (($parentX != -1) && ($parentY != -1)) {
			for($i = $indiceFinal; $i >= 0; $i--) {
				if (($listaCerrada[$i]["x"] == $parentX) && ($listaCerrada[$i]["y"] == $parentY)) {
					$parentX = $listaCerrada[$i]["px"];
					$parentY = $listaCerrada[$i]["py"];
					array_push($camino, array($listaCerrada[$i]["x"],  $listaCerrada[$i]["y"]));
					$indiceFinal = $i;
					break;
				}

			}
		  
		}
		return array_reverse($camino);
	}
}
