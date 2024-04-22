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
            debug: true
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
let fondoUser;
let txtPuntos;
let txtMonedas;
let puntos = 0;
let monedas = 0;
let enemigoSound;
let monedaSound;
let fondoSound;
let arcoSound;
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
