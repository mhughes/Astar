#!/usr/local/bin/python
# -*- coding: utf-8 -*-#

# Implementación Astar tp caece.
# Requiere Python >= 2.6
#  200 = Transitable
#  42 = obstaculo
#  15 = fin del mapa


mapa = [200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200, 42, 42, 42, 42, 42, 42, 42, 42,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200, 42, 42, 42, 42, 42,15,
        200,200,200,200,200, 42,200,200,200,200,15,
        200,200,200,200,200, 42,200, 42,200,200,15,
        200,200,200,200,200, 42, 42, 42,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15,
        200,200,200,200,200,200,200,200,200,200,15]

recorrido = [[4, 5], [3, 6], [2, 7], [1, 8], [2, 9], [3, 10], [4, 11], [5, 12],
            [4, 13], [4, 14], [4, 15], [4, 16], [5, 17], [6, 17], [7, 17],
            [8, 16], [8, 15], [7, 14], [6, 15]]


def getPixel(cx, cy):
    try:
        return mapa[(cy * 11) + cx] == 200
    except IndexError:  # pixel fuera del mapa
        return False


def pushNode(lista, nodo):
    lista.append(nodo)


def popNode(lista, indice):
    nodoTemp = lista.pop(indice)
    return nodoTemp


def esTransitable(x, y):
    return getPixel(x, y)


def estaEn(lista, x, y):
    encontrado = 0
    for j in range(len(lista)):
        if (lista[j]["x"] == x) and (lista[j]["y"] == y):
            encontrado = j + 1

    return encontrado


def obtenerG(indice):
    if (indice == 0) or (indice == 1) or (indice == 2) or (indice == 3):
        return 10
    else:
        return 14


def obtenerF(nodo):
    return nodo["g"] + nodo["h"]


def popMinCostNode(lista):
    F = 0
    indiceMenorF = 0
    minCostoF = 100000

    for i in range(len(lista)):
        F = obtenerF(lista[i])
        if(F < minCostoF):
            minCostoF = F
            indiceMenorF = i
    return popNode(lista, indiceMenorF)


def obtenerH(x, y, fx, fy):
    return 10 * (int(x - fx) + int(y - fy))


def aStar(mapa, x, y, fx, fy):

    nodoActual = {"x": x, "y": y, "px": -1, "py": -1, "g": 0, "h": 0}
    #nodo inicial no tiene parent ni F
    listaCerrada = list()
    listaAbierta = list()
    camino = list()
    adyacente = list()

    adyacente.append({"x": 0, "y": -1})
    adyacente.append({"x": -1, "y": 0})
    adyacente.append({"x": 0, "y": 1})
    adyacente.append({"x": 1, "y": 0})

    adyacente.append({"x": -1, "y": -1})
    adyacente.append({"x":  1, "y": 1})
    adyacente.append({"x":  1, "y": -1})
    adyacente.append({"x": -1, "y": 1})

    pushNode(listaAbierta, nodoActual)
    caminoEncontrado = False

    while (len(listaAbierta) != 0 and not caminoEncontrado):
        nodoAnalizado = popMinCostNode(listaAbierta)
        print nodoAnalizado["x"], nodoAnalizado["y"], nodoAnalizado["px"], nodoAnalizado["py"], nodoAnalizado["g"], nodoAnalizado["h"]
        if (nodoAnalizado["x"] == fx) and (nodoAnalizado["y"] == fy):
            caminoEncontrado = True
            print "encontrado"
        else:
            for i in range(8):
                ax = nodoAnalizado["x"] + adyacente[i]["x"]
                ay = nodoAnalizado["y"] + adyacente[i]["y"]

                if esTransitable(ax, ay):
                    indexOpen = estaEn(listaAbierta, ax, ay)
                    indexClose = estaEn(listaCerrada, ax, ay)

                    if (indexOpen == 0) and (indexClose == 0):
                        #no esta en ninguna lista asi que lo agrego en listaAbierta
                        G = nodoAnalizado["g"] + obtenerG(i)
                        H = obtenerH(ax, ay, fx, fy)
                        nodoTemp = {"x": ax, "y": ay, "px": nodoAnalizado["x"], "py": nodoAnalizado["y"], "g": G, "h": H}
                        pushNode(listaAbierta, nodoTemp)

        pushNode(listaCerrada, nodoAnalizado)

    if len(listaAbierta) == 0:
        return False
    else:
        indiceFinal = len(listaCerrada) - 1
        camino.append([listaCerrada[indiceFinal]["x"], listaCerrada[indiceFinal]["y"]])
        parentX = listaCerrada[indiceFinal]["px"]
        parentY = listaCerrada[indiceFinal]["py"]

        while ((parentX != -1) and (parentY != -1)):
            for i in range(indiceFinal, -1, -1):
                if (listaCerrada[i]["x"] == parentX) and (listaCerrada[i]["y"] == parentY):
                    parentX = listaCerrada[i]["px"]
                    parentY = listaCerrada[i]["py"]
                    camino.append([listaCerrada[i]["x"],  listaCerrada[i]["y"]])
                    indiceFinal = i
                    break
        camino.reverse()  # es inplace, no retorna nada
        return camino

#      Array   $map mapa donde se recorre todo
#      Integer $x coordenada x de entrada
#      Integer $y coordenada y de entrada
#      Integer $fx coordenada x de llegada
#      Integer $fy coordenada y de llegada
#      Array   $result resultado esperado (debug only)

output = aStar(mapa, 4, 5, 6, 15)

if not output == recorrido:
    print "No devuelve el recorrido correcto"
else:
    print "Correcto"
