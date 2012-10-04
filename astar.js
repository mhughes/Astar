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

var recorrido = [[4, 5], [3, 6], [2, 7], [1, 8], [2, 9], [3, 10], [4, 11], [5, 12],
             [4, 13], [4, 14], [4, 15], [4, 16], [5, 17], [6, 17], [7, 17],
             [8, 16], [8, 15], [7, 14], [6, 15]];


/* KEYS */

function checkKey() {
    if (!getPixel(1,1)) { putPixel(1,1,false); } else { putPixel(1,1,true); }
    updateCanvas();
}


function updateCanvas() {
    ctx.clearRect(0,0,160,320);
    //ctx.drawImage(blocks,x,y,32,32);

    drawGrid();
    putChar(4,5,1,15);//x,y de punto de partida y los pixeles de la imagen
    putChar(6,15,3,15);//punto de llegada
    //drawBlock(x,y,pieza);
}
    
    
function putChar(cx, cy, tipo_bloque, numero_bloque) {
    ctx.drawImage(blocks,(numero_bloque-1)*8,(tipo_bloque-1)*8,8,8,cx*16,cy*16,16,16);
}


function putCharInMatriz(mapa, cx, cy, tipo_bloque, numero_bloque) {
    mapa[cy*11 + cx] = ((tipo_bloque-1) * 20) + numero_bloque;
} 


function putPixel(mapa, cx, cy, on) {
    if(on) { mapa[cy*11 + cx] = 15; } else { mapa[cy*11 + cx] = 200; } 
}

function getPixel(mapa, cx,cy) {
    if(mapa[cy*11 + cx] == 200) { return true; } else { return false; }
}

function drawGrid(mapa) {
    for(py=0; py<20; py++){
        for(px=0;px<10; px++) {
            if(mapa[(py*11)+px] !== 0) { putChar(px,py, getTipoBloque(mapa[(py*11)+px]), getNumBloque(mapa[(py*11)+px]));}
        }
    }
}

function getTipoBloque(numChar) {
  return(Math.floor((numChar - 1) / 20) + 1);
}
  
function getNumBloque(numChar) {
  return(numChar - (Math.floor((numChar - 1) / 20)*20));
}
    
function pushNode(lista, nodo) {
    lista.push(nodo);
}

function popNode(lista, indice) {
    nodoTemp = lista.splice(indice,1);
    return nodoTemp[0];
}

function esTransitable(x,y) {
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
  if( (indice == 0 ) || (indice == 1 ) || (indice == 2 ) ||(indice == 3 ) ) { return 10 } else { return 14 };
}


function obtenerF(nodo) {
  return nodo.g + nodo.h;
}


function  popMinCostNode(lista) {
    var F = 0;
    var indiceMenorF = 0;
    minCostoF = 100000;
    
    for(var i = 0; i<lista.length; i++) {
      F = obtenerF(lista[i]);
      if(F < minCostoF) { 
        minCostoF = F;
        indiceMenorF = i;
      }
    }
  
    return popNode(lista,indiceMenorF);
  
} // end extractNodeMenorCosto


function obtenerH(x,y,fx,fy) {
  return 10 * (Math.abs(x - fx) + Math.abs(y - fy));
}

var aStar = function(map, x, y, fx, fy){
      
    var nodoActual = { x : x, y : y, px : -1, py : -1, g : 0, h : 0 }; 
    // nodo inicial no tiene parent ni F

    var adyacente = [];

    adyacente[0] = { x :  0, y : -1 };
    adyacente[1] = { x : -1, y :  0 };
    adyacente[2] = { x :  0, y :  1 };
    adyacente[3] = { x :  1, y :  0 };
      
    adyacente[4] = { x :  -1, y :  -1 };
    adyacente[5] = { x :  1, y :  1 };
    adyacente[6] = { x :  1, y :  -1 };
    adyacente[7] = { x :  -1, y :  1 };     

    var listaCerrada = [],
        listaAbierta = [],
        camino = [];


    pushNode(listaAbierta, nodoActual);
    var caminoEncontrado = false;

    while ((listaAbierta.length !== 0) && (!caminoEncontrado)) {

        extractNode = popMinCostNode(listaAbierta);

        // inicio analisis de nodos
        if ((extractNode.x == fx) && (extractNode.y == fy)) {
            // LLEGUE AL OBJETIVO
            //pushNode(listaCerrada, extractNode);
            caminoEncontrado = true;

        } else {
            //para cada nodo adjacente
            for(i=0; i<8; i++) {
                var ax = extractNode.x + adyacente[i].x;
                var ay = extractNode.y + adyacente[i].y;
                //verificar si es transitable
                if (esTransitable(ax,ay)) {
                    var indexOpen = estaEn(listaAbierta,ax,ay);
                    var indexClose = estaEn(listaCerrada,ax,ay);
                    //no esta en la lista abierta ni cerrada
                    if ((indexOpen === 0) && (indexClose === 0)) {
                        // no esta en ninguna lista asi que lo agrego en listaAbierta
                        var G = extractNode.g + obtenerG(i);
                        var H = obtenerH(ax,ay,fx,fy);
                        nodoTemp = { x : ax, y : ay, px : extractNode.x, py : extractNode.y, g : G, h : H };
                        //alert(listaAbierta.length);
                        pushNode(listaAbierta, nodoTemp);
                    }
                } // si es transitable.
            } // END FOR

        } // fin analisis de nodos

        pushNode(listaCerrada, extractNode);
    } // fin while

    if(listaAbierta.length === 0) {
        return false; 
    } else {
        
        var indiceFinal = listaCerrada.length - 1;
        camino.push({x : listaCerrada[indiceFinal].x, y : listaCerrada[indiceFinal].y});
        parentX = listaCerrada[indiceFinal].px;
        parentY = listaCerrada[indiceFinal].py;
        
        
        while ((parentX != -1) && (parentY != -1)) {
            for(i = indiceFinal; i >= 0; i--) {
                // buscar en la lista donde esta Px y Py
                //alert(indiceFinal);

                if ((listaCerrada[i].x == parentX) && (listaCerrada[i].y == parentY)) {
                    parentX = listaCerrada[i].px;
                    parentY = listaCerrada[i].py;
                    camino.push({x : listaCerrada[i].x, y : listaCerrada[i].y});
                    indiceFinal = i;
                    break;  
                }
            }
        }
        return camino.reverse();
    }
};

var output = aStar(mapa, 4, 5, 6, 15);

if(output === recorrido){
    console.log("Correcto");
}else{
    console.log("No devuelve el recorrido correcto");
}
