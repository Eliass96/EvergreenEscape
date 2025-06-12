let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.CONTAIN,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
        orientation: 'landscape'
    },
    roundPixels: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 1400},
            debug: false
        }
    },
    fps: 120,
    autoFocus: true,
    scene: [gameScene]
}

let context;
let game = new Phaser.Game(config);
let cursors;
let jugador;
let moneda;
let monedero = [];
let orco;
let enemigos = [];
let fondo;
let suelo;
let txtPuntos;
let txtHightScore;
let txtMonedas;
let puntos = 0;
let hightScore = 0;
let monedas = 0;
let enemigoSound;
let monedaSound;
let fondoSound;
let arcoSound;
let usuario;
let orcoVerdeSound;
let defeatSound;
let piedra;
let piedras = [];
let plataforma;
let plataformas = [];
let pincho;
let pinchos = [];
let canMove = false;
let estaVivo = true;
let velocidad = 20;
let orcoVerde;
let orcosVerdes = [];
let flechaJugador;
let flechasJugador = [];
let disparando = false;
let botonPausa;
let botonPlay;
let botonRevivir;
let botonDisparar;
let botonAjustesPausa;
let botonAjustesGameOver;
let botonAceptarAjustes;
let botonCancelarAjustes;
let checkboxMusica;
let checkboxSonido;
let modalAMostrar;
let colorTexto;
let puntx2;
let antiObstaculos;
let botonSuperSalto;
let puntosASumar= 1;
let alturaSalto= -725;
let puedeMorir= true;
let cantidadPuntuacionx2;
let cantidadRevivir;
let cantidadSuperSalto;
let cantidadAntiObstaculos;
let contadorTiempoPuntuacionx2;
let contadorTiempoAntiObstaculos;
let contadorTiempoSuperSalto;
let textoPuntuacionx2;
let textoRevivir;
let textoAntiObstaculos;
let textoSuperSalto;
let musicaActiva;
let sonidoActivo;
let musicaCambiado;
let sonidoCambiado;
let estaAntiObstaculosActivo;
let estaX2Activo;
let estaSuperSaltoActivo;