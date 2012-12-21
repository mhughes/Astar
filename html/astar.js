(function($) {
  $(document).ready(function() {
    init();
  });
  
  function initCanvas() {

    var canvas = document.getElementById('mapa');

    if (canvas.getContext){
      ctx = canvas.getContext('2d');
      ctx.mozImageSmoothingEnabled = false;
      blocks = new Image(); // declarar sin "var" produce q sean globales


      blocks.src ='/img/imagen.png';

    } else {
      alert("Su navegador no soporta html5 - se recomienda actualizarlo."); // no se detecto canvas
    }      
  }
  
  function updateCanvas() {
    ctx.clearRect(0,0,160,320);

    drawGrid();
    putChar(4,5,1,15);//x,y de punto de partida y los pixeles de la imagen
    putChar(6,15,3,15);//punto de llegada
  }

  function putChar(cx,cy,tipo_bloque,numero_bloque) {
    //context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
    ctx.drawImage(blocks,(numero_bloque-1)*8,(tipo_bloque-1)*8,8,8,cx*16,cy*16,16,16);
  }

  function putCharInMatriz(cx,cy,tipo_bloque, numero_bloque) {
    pl1[cy*11 + cx] = ((tipo_bloque-1) * 20) + numero_bloque;
  } 

  function drawGrid() {   
    for(py=0; py<20; py++){
      for(px=0;px<10; px++) {
        if(pl1[(py*11)+px] != 0) {
          putChar(px,py, getTipoBloque(pl1[(py*11)+px]), getNumBloque(pl1[(py*11)+px]));
        }
      }
    } 
  }

  function getTipoBloque(numChar) {
    return(Math.floor((numChar - 1) / 20) + 1);
  }

  function getNumBloque(numChar) {
    return(numChar - (Math.floor((numChar - 1) / 20)*20));
  }

  function esTransitable(x,y) {
    return getPixel(x,y);
  }

  function init(){
    // inicializo la variable canvas, con el contenido del <canvas> del documento.
    initCanvas();

    // inicializo variables que usare 
    pl1 =    [ 200,200,200,200,200,200,200,200,200,200,15,
    200,200,200,200,200,200,200,200,200,200,15,
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
    200,200,200,200,200,200,200,200,200,200,15   ]

    updateCanvas();
    
    $.get('/ajax.php', function(caminoEncontrado) {
      caminoEncontrado = caminoEncontrado.data;
      clock1 = setInterval(function() {
        putCharInMatriz(caminoEncontrado[indiceCaminoEncontrado].x,caminoEncontrado[indiceCaminoEncontrado].y,1,15);
        indiceCaminoEncontrado++;
        updateCanvas();
        if (indiceCaminoEncontrado >= caminoEncontrado.length) {
          clearInterval(clock1);
        }
      }, 500);
      indiceCaminoEncontrado = 0;
    }, 'json');
  }
})(jQuery);