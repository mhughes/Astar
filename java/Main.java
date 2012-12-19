import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Main {
	
	static int [] mapa = {	200,200,200,200,200,200,200,200,200,200,15 ,
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
					        200,200,200,200,200,200,200,200,200,200,15   };
	
	static Nodo[] recorrido = {new Nodo(4, 5), new Nodo(3, 6), new Nodo(2, 7), new Nodo(1, 8), new Nodo(2, 9), new Nodo(3, 10), new Nodo(4, 11), new Nodo(5, 12),
	                 new Nodo(4, 13), new Nodo(4, 14), new Nodo(4, 15), new Nodo(4, 16), new Nodo(5, 17), new Nodo(6, 17), new Nodo(7, 17),
	                 new Nodo(8, 16), new Nodo(8, 15), new Nodo(7, 14), new Nodo(6, 15)};
	
	public static void pushNode(List<Nodo> lista, Nodo nodo) {
	    lista.add(nodo);
	}
	
	public static int estaEn(List<Nodo> lista,int x,int y) {
	    int encontrado = 0;
	    for(int j=0; j<lista.size(); j++) {
	        if( (lista.get(j).getX() == x) && ((lista.get(j).getY() == y) )) {
	            encontrado = j + 1;
	        }
	    }
	    return encontrado;
	}
	
	public static int obtenerG(int indice) {
		switch (indice){
		case 0:
		case 1:
		case 2: 
		case 3:
			return 10;
		default: 
			return 14;
		}
	}
	
	public static int obtenerH(int x,int y,int fx,int fy) {
		  return 10 * (Math.abs(x - fx) + Math.abs(y - fy));
		}
	
	public static boolean getPixel(int cx,int cy) {
		try {
			if(mapa[cy*11 + cx] == 200) { return true; } else { return false; }
		} catch (ArrayIndexOutOfBoundsException e) {
			return false;
		}
	}
	
	public static int obtenerF(Nodo nodo) {
	    return nodo.getG() + nodo.getH();
	}
	
	public static Nodo popNode(List<Nodo> lista, int indice) {
	    Nodo nodoTemp = lista.remove(indice);
	    return nodoTemp;
	}
	
	public static boolean esTransitable(int x, int y) {
	    return getPixel(x,y);
	}
	
	public static Nodo popMinCostNode(List<Nodo> lista) {
	    int F = 0,
	    indiceMenorF = 0,
	    minCostoF = 100000;
	    
	    for(int i = 0; i < lista.size(); i++) {
	      F = obtenerF(lista.get(i));
	      if(F < minCostoF) {
	        minCostoF = F;
	        indiceMenorF = i;
	      }
	    }
	    return popNode(lista,indiceMenorF);
	  
	} // end nodoAnalizadoMenorCosto
	
	 public static Object aStar(int [] mapa, int x,int y,int fx,int fy) {
		 	Nodo nodoAnalizado;
	      	Nodo nodoActual = new Nodo(x, y, -1, -1, 0, 0);
		    // nodo inicial no tiene parent ni F
		    List<Nodo> listaCerrada = new ArrayList<Nodo>(),
		    listaAbierta = new ArrayList<Nodo>(),
		    camino = new ArrayList<Nodo>();
		    Nodo[] adyacente = new Nodo[8];

		    adyacente[0] = new Nodo(0,-1);
		    adyacente[1] = new Nodo(-1,0);
		    adyacente[2] = new Nodo(0,1);
		    adyacente[3] = new Nodo(1,0);

		    adyacente[4] = new Nodo(-1,-1);
		    adyacente[5] = new Nodo(1,1);
		    adyacente[6] = new Nodo(1,-1);
		    adyacente[7] = new Nodo(-1,1);

		    pushNode(listaAbierta, nodoActual);
		    boolean caminoEncontrado = false;

		    while ((!listaAbierta.isEmpty()) && (!caminoEncontrado)) {
		        nodoAnalizado = popMinCostNode(listaAbierta);

		        if ((nodoAnalizado.getX() == fx) && (nodoAnalizado.getY() == fy)) {
		            caminoEncontrado = true;
		        } else {
		            for(int i=0; i<8 ; i++) {//8 es la cantidad de nodos adjacentes.
		                int ax = nodoAnalizado.getX() + adyacente[i].getX();
		                int ay = nodoAnalizado.getY() + adyacente[i].getY();
		                if (esTransitable(ax, ay)) {
		                    int indexOpen = estaEn(listaAbierta,ax,ay);
		                    int indexClose = estaEn(listaCerrada,ax,ay);
		                    if ((indexOpen == 0) && (indexClose == 0)) {
		                        // no esta en ninguna lista asi que lo agrego en listaAbierta
		                        int G = nodoAnalizado.getG() + obtenerG(i);
		                        int H = obtenerH(ax,ay,fx,fy);
		                        Nodo nodoTemp = new Nodo(ax,ay,nodoAnalizado.getX(),nodoAnalizado.getY(),G,H);
		                      
		                        pushNode(listaAbierta, nodoTemp);
		                    }
		                } // si es transitable.
		            } // END FOR
		        } // fin analisis de nodos
		        pushNode(listaCerrada, nodoAnalizado);
		    } // fin while
		      
		    if(listaAbierta.isEmpty()){
		        return false;
		    } else {
		        int indiceFinal = listaCerrada.size() - 1;
		        camino.add(new Nodo(listaCerrada.get(indiceFinal).getX(), listaCerrada.get(indiceFinal).getY()));
		        int parentX = listaCerrada.get(indiceFinal).getPx();
		        int parentY = listaCerrada.get(indiceFinal).getPy();

		        while ((parentX != -1) && (parentY != -1)) {
		            for(int i = indiceFinal; i >= 0; i--) {
		                if ((listaCerrada.get(i).getX() == parentX) && ((listaCerrada.get(i).getY() == parentY))) {
		                    parentX = listaCerrada.get(i).getPx();
		                    parentY = listaCerrada.get(i).getPy();
		                    camino.add(new Nodo(listaCerrada.get(i).getX(), listaCerrada.get(i).getY()));
		                    indiceFinal = i;
		                    break;
		                }

		            }
		          
		        }
		        Collections.reverse(camino);
		        return camino;
		    }
		      
		} // END astar
	 
	public static void main(String[] args) {
		List<Nodo> output = (List<Nodo>)aStar(mapa, 4, 5, 6, 15);
		assertArrayEquals("output y el recorrido deberian ser iguales.",recorrido, output.toArray(new Nodo[output.size()]));
		Jsonificar(output);
	}

	private static void Jsonificar(List<Nodo> output) {
		StringBuilder sb = new StringBuilder("{\"data\":");
		sb.append(output.toString());
		sb.append("}");
		System.out.println(sb);
		
	}

	private static void assertArrayEquals(String string, Nodo[] recorrido2,
			Nodo[] array) {
		for (int i = 0; i < array.length; i++) {
			if (!recorrido2[i].equals(array[i])) {
				System.out.println(string);
			}
		}
	}

}

class Nodo {

	private int x;

	private int y;

	private int px;

	private int py;

	private int g;

	private int h;

	public Nodo(int x, int y, int px, int py, int g, int h) {
		this.x = x;
		this.y = y;
		this.px = px;
		this.py = py;
		this.g = g;
		this.h = h;
	}

	public Nodo(int x, int y) {
		this.x = x;
		this.y = y;
	}

	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public int getPx() {
		return px;
	}

	public void setPx(int px) {
		this.px = px;
	}

	public int getPy() {
		return py;
	}

	public void setPy(int py) {
		this.py = py;
	}

	public int getG() {
		return g;
	}

	public void setG(int g) {
		this.g = g;
	}

	public int getH() {
		return h;
	}

	public void setH(int h) {
		this.h = h;
	}

	@Override
	public String toString() {
		return "{\"x\":" + x + ",\"y\":" + y + "}";
	}

	@Override
	public boolean equals(Object obj) {
		Nodo elem = (Nodo) obj;
		return (this.x == elem.getX() && this.y == elem.getY());
	}

}