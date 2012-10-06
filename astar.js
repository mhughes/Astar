var assert = require("assert");

/**
 *
 * Implementación Astar tp caece.
 * Requiere node.js
 * 200 = Transitable
 * 42 = obstaculo
 * 15 = fin del mapa
**/

var mapa = [200,200,200,200,200,200,200,200,200,200,15 ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,42,42,42,42,42,42,42,42,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,42,42,42,42,42,15   ,
      200,200,200,200,200,42,200,200,200,200,15   ,
      200,200,200,200,200,42,200,42,200,200,15   ,
      200,200,200,200,200,42,42,42,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15   ,
      200,200,200,200,200,200,200,200,200,200,15];

var recorrido = [[4, 5], [3, 6], [2, 7], [1, 8], [2, 9], [3, 10], [4, 11], [5, 12],
             [4, 13], [4, 14], [4, 15], [4, 16], [5, 17], [6, 17], [7, 17],
             [8, 16], [8, 15], [7, 14], [6, 15]];


function getPixel(cx,cy) {
    if(mapa[cy*11 + cx] == 200) { return true; } else { return false; }
}

function pushNode(lista, nodo) {
    lista.push(nodo);
}

function popNode(lista, indice) {
    var nodoTemp = lista.splice(indice,1);
    return nodoTemp[0];
}

function esTransitable(x, y) {
    return getPixel(x,y);
}

function estaEn(lista,x,y) {
    var encontrado = 0;
    for(var j=0; j<lista.length; j++) {
        if( (lista[j].x == x) && (lista[j].y == y) ) {
            encontrado = j + 1;
        }
    }
    return encontrado;
}

function obtenerG(indice) {
    if( (indice === 0 ) || (indice === 1 ) || (indice === 2 ) ||(indice === 3 ) ) { return 10; } else { return 14; }
}

function obtenerF(nodo) {
    return nodo.g + nodo.h;
}

function  popMinCostNode(lista) {
    var F = 0,
        indiceMenorF = 0,
        minCostoF = 100000;
    
    for(var i = 0; i<lista.length; i++) {
      F = obtenerF(lista[i]);
      if(F < minCostoF) { 
        minCostoF = F;
        indiceMenorF = i;
      }
    }
  
    return popNode(lista,indiceMenorF);
  
} // end nodoAnalizadoMenorCosto


function obtenerH(x,y,fx,fy) {
  return 10 * (Math.abs(x - fx) + Math.abs(y - fy));
}

 function aStar(mapa, x,y,fx,fy) {
      
      nodoActual = { x : x, y : y, px : -1, py : -1, g : 0, h : 0 }; 
      // nodo inicial no tiene parent ni F
      
      adyacente = new Array();

      adyacente[0] = { x :  0, y : -1 };
      adyacente[1] = { x : -1, y :  0 };
      adyacente[2] = { x :  0, y :  1 };
      adyacente[3] = { x :  1, y :  0 };
      
      adyacente[4] = { x :  -1, y :  -1 };
      adyacente[5] = { x :  1, y :  1 };
      adyacente[6] = { x :  1, y :  -1 };
      adyacente[7] = { x :  -1, y :  1 };     

      listaCerrada = new Array();
      listaAbierta = new Array();
      var camino = new Array();
      
      
      pushNode(listaAbierta, nodoActual);
      var caminoEncontrado = false;

      while ((listaAbierta.length != 0) && (caminoEncontrado == false)) {
            nodoAnalizado = popMinCostNode(listaAbierta);
      
            if ((nodoAnalizado.x == fx) && (nodoAnalizado.y == fy)) {
              caminoEncontrado = true;
              console.log("encontrado!");
             
            } else {
                  for(i=0; i<8; i++) {
                    var ax = nodoAnalizado.x + adyacente[i].x;
                    var ay = nodoAnalizado.y + adyacente[i].y;

                    if (esTransitable(ax, ay)) {
                      var indexOpen = estaEn(listaAbierta,ax,ay);
                      var indexClose = estaEn(listaCerrada,ax,ay);
                        
                          if ((indexOpen == 0) && (indexClose == 0)) {
                            // no esta en ninguna lista asi que lo agrego en listaAbierta
                            var G = nodoAnalizado.g + obtenerG(i);
                            var H = obtenerH(ax,ay,fx,fy);
                            nodoTemp = { x : ax, y : ay, px : nodoAnalizado.x, py : nodoAnalizado.y, g : G, h : H };
                            //alert(listaAbierta.length);
                            pushNode(listaAbierta, nodoTemp);
                          }
                    } // si es transitable.
                  } // END FOR
        
             } // fin analisis de nodos

        pushNode(listaCerrada, nodoAnalizado);
        } // fin while
      






      if(listaAbierta.length === 0) {
        return false;
      } else {
        
        var indiceFinal = listaCerrada.length - 1;
        camino.push([listaCerrada[indiceFinal].x, listaCerrada[indiceFinal].y]);
        parentX = listaCerrada[indiceFinal].px;
        parentY = listaCerrada[indiceFinal].py;
        
        
        while ((parentX != -1) && (parentY != -1)) {

          for(i = indiceFinal; i >= 0; i--) {
            // buscar en la lista donde esta Px y Py
          //alert(indiceFinal);

            if ((listaCerrada[i].x == parentX) && (listaCerrada[i].y == parentY)) {
              parentX = listaCerrada[i].px;
              parentY = listaCerrada[i].py;
              camino.push([listaCerrada[i].x,  listaCerrada[i].y]);
              indiceFinal = i;
              break;
            }

          }
          
        }
        return camino.reverse();
      }
      
    } // END FUNCTION

var output = aStar(mapa, 4, 5, 6, 15);

assert.deepEqual(output, recorrido, "output y el recorrido deberian ser iguales.");
