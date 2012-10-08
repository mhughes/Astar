<?php
/**
 * Implementación Astar tp caece.
 * Requiere PHP >= 5.4.0
 *
 * 200 = Transitable
 * 42 = obstaculo
 * 15 = fin del mapa
 **/
$mapa = [200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,  
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,042,042,042,042,042,042,042,042,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,042,042,042,042,042,15   ,
	  200,200,200,200,200,042,200,200,200,200,15   ,
	  200,200,200,200,200,042,200,042,200,200,15   ,
	  200,200,200,200,200,042,042,042,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15   ,
	  200,200,200,200,200,200,200,200,200,200,15];

$recorrido = [[4,5],[3,6],[2,7],[1,8], [2,9], [3,10], [4,11], [5,12], [4,13], [4,14], [4,15], [4,16], [5,17],[6,17],[7,17], [8,16], [8,15], [7,14], [6,15]];




function getPixel($cx, $cy) {
	global $mapa;
    if($mapa[$cy*11 + $cx] == 200) { return true; } else { return false; }
}


function popNode(&$lista, $indice) {
    $return = $lista[$indice];
    unset($lista[$indice]);
    foreach($lista as $item){
    	$listanew[] = $item;
    }
    $lista = $listanew;
    return $return;	
}

function esTransitable($x, $y) {
    return getPixel($x, $y);
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

function  popMinCostNode(&$lista) {
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
    return popNode($lista,$indiceMenorF);
  
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
function aStar($map, $x,$y,$fx,$fy){
	$nodoActual = ["x" => $x, "y" => $y, "px" => -1, "py" => -1, "g" => 0, "h" => 0 ];
	// nodo inicial no tiene parent ni F
	$listaCerrada = [];
	$listaAbierta = [];
	$camino = [];
	$adyacente = [];

	$adyacente[0] = [ "x" =>  0, "y" => -1 ];
	$adyacente[1] = [ "x" => -1, "y" =>  0 ];
	$adyacente[2] = [ "x" =>  0, "y" =>  1 ];
	$adyacente[3] = [ "x" =>  1, "y" =>  0 ];

	$adyacente[4] = [ "x" => -1, "y" => -1 ];
	$adyacente[5] = [ "x" =>  1, "y" =>  1 ];
	$adyacente[6] = [ "x" =>  1, "y" => -1 ];
	$adyacente[7] = [ "x" => -1, "y" =>  1 ];

	$listaAbierta[] = $nodoActual;
	$caminoEncontrado = false;

	while ((count($listaAbierta) !== 0) && (!$caminoEncontrado)) {

		$nodoAnalizado = popMinCostNode($listaAbierta);

		if (($nodoAnalizado["x"] == $fx) && ($nodoAnalizado["y"] == $fy)) {
			$caminoEncontrado = true;
		} else {
			for($i=0; $i<8; $i++) {//8 es la cantidad de nodos adjacentes.
				$ax = $nodoAnalizado["x"] + $adyacente[$i]["x"];
				$ay = $nodoAnalizado["y"] + $adyacente[$i]["y"];

				if (esTransitable($ax, $ay)) {
					$indexOpen = estaEn($listaAbierta,$ax,$ay);
					$indexClose = estaEn($listaCerrada,$ax,$ay);

					if (($indexOpen == 0) && ($indexClose == 0)) {
						// no esta en ninguna lista asi que lo agrego en listaAbierta
						$G = $nodoAnalizado["g"] + obtenerG($i);
						$H = obtenerH($ax,$ay,$fx,$fy);
						$nodoTemp = ["x" => $ax, "y" => $ay, "px" => $nodoAnalizado["x"], "py" => $nodoAnalizado["y"], "g" => $G, "h" => $H ];
						
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
		array_push($camino, [$listaCerrada[$indiceFinal]["x"], $listaCerrada[$indiceFinal]["y"]]);
		$parentX = $listaCerrada[$indiceFinal]["px"];
		$parentY = $listaCerrada[$indiceFinal]["py"];

		while (($parentX != -1) && ($parentY != -1)) {
			for($i = $indiceFinal; $i >= 0; $i--) {
				if (($listaCerrada[$i]["x"] == $parentX) && ($listaCerrada[$i]["y"] == $parentY)) {
					$parentX = $listaCerrada[$i]["px"];
					$parentY = $listaCerrada[$i]["py"];
					array_push($camino, [$listaCerrada[$i]["x"],  $listaCerrada[$i]["y"]]);
					$indiceFinal = $i;
					break;
				}

			}
		  
		}
		return array_reverse($camino);
	}
}

$output = aStar($map, 4, 5, 6, 15);

if($output != $recorrido){
	  echo "No deasvuelve el recorrido correcto";
}else{
	  echo "Correcto";
}