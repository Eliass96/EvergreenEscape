class gameScene extends Phaser.Scene {
    constructor() {
        super("nivel1");
    }

    preload() {
        this.load.image("fondoBosque", "../../assets/background/fondoBosque.jpg");
        this.load.image("fondoBosqueNoche", "../../assets/background/fondoBosqueNoche.jpg");
        this.load.image("piedra", "../../assets/components/piedra.png");
        this.load.image("plataforma", "../../assets/components/plataforma.png");
        this.load.image("pincho", "../../assets/components/pinchos.png");
        this.load.image("botonPausa", "../../img/buttons/pause.png");
        botonPlay = document.getElementById('botonPlay');
        botonPausa = document.getElementById('botonPausa');
        botonRevivir = document.getElementById('botonRevivir');
        botonAjustesPausa = document.getElementById('botonSettings_pause');
        botonAjustesGameOver = document.getElementById('botonSettings_gameOver');
        botonAceptarAjustes = document.getElementById('but_aceptar_ajustes');
        botonCancelarAjustes = document.getElementById('but_cancelar_ajustes');
        botonDisparar = document.getElementById('botonDisparar');
        contadorTiempoPuntuacionx2 = document.getElementById('contadorTiempoPuntuacionx2');
        contadorTiempoAntiObstaculos = document.getElementById('contadorTiempoAntiObstaculos');
        contadorTiempoSuperSalto = document.getElementById('contadorTiempoSuperSalto');
        textoPuntuacionx2 = document.getElementById('cantidadPuntuacionx2');
        textoAntiObstaculos = document.getElementById('cantidadAntiObstaculos');
        textoSuperSalto = document.getElementById('cantidadSuperSalto');
        textoRevivir = document.getElementById("cantidadRevivir");
        puntx2 = document.getElementById('botonx2');
        antiObstaculos = document.getElementById('botonAntiObstaculos');
        botonSuperSalto = document.getElementById('botonSuperSalto');
        checkboxMusica = document.getElementById('bauble_check_musica');
        checkboxSonido = document.getElementById('bauble_check_sonido');
        checkboxPantallaCompleta = document.getElementById('bauble_check_pantalla_completa');
        $('#botonPausa').hide();
        $('#botonAntiObstaculos').hide();
        $('#botonSuperSalto').hide();
        $('#botonx2').hide();
        $('#botonDisparar').hide();

        this.load.spritesheet("jugador", "../../assets/character/main/Run.png", {frameWidth: 128, frameHeight: 128});
        this.load.spritesheet("muerteJugador", "../../assets/character/main/Dead.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("saltoJugador", "../../assets/character/main/Jump.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("disparoJugador", "../../assets/character/main/Shot_1.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.image("flechaJugador", "../../assets/character/main/Arrow.png");


        this.load.spritesheet("moneda", "../../assets/components/coin.png", {frameWidth: 128, frameHeight: 128});
        this.load.spritesheet("orcoRojo", "../../assets/character/enemies/red/Run.png", {
            frameWidth: 96,
            frameHeight: 96
        });
        this.load.spritesheet("orcoVerde", "../../assets/character/enemies/green/Run.png", {
            frameWidth: 96,
            frameHeight: 96
        });
        this.load.spritesheet("matarOrco", "../../assets/character/enemies/green/Dead.png", {
            frameWidth: 96,
            frameHeight: 96
        });
        this.load.spritesheet("ataqueOrcoRojo", "../../assets/character/enemies/red/Attack_2.png", {
            frameWidth: 96,
            frameHeight: 96
        });
        this.load.spritesheet("ataqueOrcoVerde", "../../assets/character/enemies/green/Attack_1.png", {
            frameWidth: 96,
            frameHeight: 96
        });

        this.load.audio("orcosonido", "../../assets/audio/enemigos.mp3");
        this.load.audio("monedasonido", "../../assets/audio/moneda.mp3");
        this.load.audio("sonidofondo", "../../assets/audio/musicafondo.mp3");
        this.load.audio("muertesonido", "../../assets/audio/defeat.mp3");
        this.load.audio("orcoverdesonido", "../../assets/audio/orcoVerde.mp3");
        this.load.audio("arcosonido", "../../assets/audio/arco.mp3");
    }

    async create() {
        fondoSound = this.sound.add("sonidofondo");
        try {
            let urlUsuario = '/usuarios/usuario';
            let resp = await fetch(urlUsuario);
            if (resp.ok) {
                usuario = await resp.json();
                if (usuario.fondoClaro) {
                    fondo = this.add.tileSprite(0, 0, 0, 0, "fondoBosque").setOrigin(0);
                    colorTexto = "#000000FF"
                } else {
                    fondo = this.add.tileSprite(0, 0, 0, 0, "fondoBosqueNoche").setOrigin(0);
                    colorTexto = "#FFFFFFFF"
                }

                if (usuario.musica) {
                    fondoSound.play();
                    fondoSound.volume = 0.2;
                    fondoSound.loop = true;
                }

                hightScore = Math.max(...usuario.puntuaciones);
                cantidadPuntuacionx2 = usuario.puntuacionExtra;
                cantidadSuperSalto = usuario.superSalto;
                cantidadAntiObstaculos = usuario.inmunidad;
                cantidadRevivir = usuario.revivir;
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "No has iniciado sesión",
                    text: "¡Tienes que iniciar sesión para poder acceder al juego!",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    document.location.href = "../html/login.html";
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ups...",
                text: "Error inesperado al cargar el juego... Pruebe a reiniciar la página",
            });
        }

        context = this;
        // Sonidos
        enemigoSound = this.sound.add("orcosonido");
        monedaSound = this.sound.add("monedasonido");
        defeatSound = this.sound.add("muertesonido");
        orcoVerdeSound = this.sound.add("orcoverdesonido");
        arcoSound = this.sound.add("arcosonido");

        // Animaciones
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers("jugador", {start: 0, end: 7}),
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers("muerteJugador", {start: 0, end: 2}),
            frameRate: 2
        });

        this.anims.create({
            key: 'revivir',
            frames: this.anims.generateFrameNumbers("muerteJugador", {start: 2, end: 0}),
            frameRate: 2
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers("saltoJugador", {start: 0, end: 7}),
            frameRate: velocidad / 4
        });

        this.anims.create({
            key: 'shot',
            frames: this.anims.generateFrameNumbers("disparoJugador", {start: 0, end: 13}),
            frameRate: 30
        });


        this.anims.create({
            key: 'moneda',
            frames: this.anims.generateFrameNumbers("moneda", {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'orcoRojo',
            frames: this.anims.generateFrameNumbers("orcoRojo", {start: 0, end: 5}),
            frameRate: velocidad / 4,
            repeat: -1
        });

        this.anims.create({
            key: 'orcoVerde',
            frames: this.anims.generateFrameNumbers("orcoVerde", {start: 0, end: 5}),
            frameRate: velocidad / 4,
            repeat: -1
        });
        this.anims.create({
            key: 'matarOrco',
            frames: this.anims.generateFrameNumbers("matarOrco", {start: 0, end: 3}),
            frameRate: 7
        });
        this.anims.create({
            key: 'ataqueOrcoRojo',
            frames: this.anims.generateFrameNumbers("ataqueOrcoRojo", {start: 0, end: 4}),
            frameRate: 10
        });

        this.anims.create({
            key: 'ataqueOrcoVerde',
            frames: this.anims.generateFrameNumbers("ataqueOrcoVerde", {start: 0, end: 3}),
            frameRate: 10
        });

        // Fondo
        fondo.displayWidth = game.config.width;
        fondo.displayHeight = game.config.height;
        fondo.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

        // Jugador
        jugador = this.physics.add.sprite(250, -400, "jugador");
        jugador.setScale(2);
        jugador.body.setSize(38, 75); // Establecemos el tamaño de la hitbox del jugador
        jugador.body.setOffset(40, 53);
        jugador.setCollideWorldBounds(true);
        jugador.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);

        // Flecha
        flechaJugador = context.physics.add.image(jugador.x, jugador.y, "flechaJugador").setScale(2.5);
        flechaJugador.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        flechaJugador.body.setAllowGravity(false);
        flechaJugador.disableBody(true, true);
        flechaJugador.setScale(2.5);
        flechaJugador.setSize(40, 10);

        // Monedas
        this.physics.add.overlap(jugador, monedero, cogerMonedas, null, this)

        // Enemigos y obstáculos
        this.physics.add.overlap(jugador, enemigos, morir, null, this)
        this.physics.add.overlap(jugador, orcosVerdes, morir, null, this)
        this.physics.add.overlap(jugador, piedras, morir, null, this)
        this.physics.add.overlap(jugador, pinchos, morir, null, this)
        this.physics.add.overlap(flechasJugador, orcosVerdes, matarOrco, null, this)

        // Delay para moverse
        this.time.delayedCall(1150, enableMovement, [], this);
        this.time.delayedCall(1200, enableAnimation, [], this);
        this.time.delayedCall(1470, sumarPuntos, [], this);
        this.time.delayedCall(0, generarMonedas, [], this);
        this.time.delayedCall(0, generarObstaculos, [], this);

        // Suelo
        suelo = this.physics.add.staticGroup();
        suelo.create(1000, 1000, "suelo").setScale(80, 1.5).setSize(1920, 45).setOffset(-980, -25);
        suelo.setAlpha(0)
        this.physics.add.collider(suelo, jugador);
        this.physics.add.collider(suelo, monedero);
        this.physics.add.collider(suelo, moneda);
        this.physics.add.collider(suelo, orco);
        this.physics.add.collider(suelo, pincho);
        this.physics.add.collider(suelo, flechaJugador);
        this.physics.add.collider(suelo, orcoVerde);

        // Botones
        botonPausa.addEventListener('click', async function () {
            $('#modalPause').modal({backdrop: 'static', keyboard: false}).modal('show');
            context.physics.pause();
            flechasJugador.forEach(function (flecha) {
                flecha.setVelocityY(0);
            });
            canMove = false;
            // Detener la animación del jugador
            jugador.anims.stop();

            // Detener la gravedad del jugador y establecer su velocidad vertical en 0
            jugador.setVelocityY(0);
            jugador.setAccelerationY(0); // Asegúrate de que no haya aceleración que pueda hacer que el jugador caiga

            enemigos.forEach(function (orco) {
                orco.anims.stop();
            });
            orcosVerdes.forEach(function (orco) {
                orco.anims.stop();
            });
            monedero.forEach(function (moneda) {
                moneda.anims.stop();
            });
        }, this);

        botonPlay.addEventListener('click', async function () {
            if (estaVivo) {
                context.physics.resume();
                $('#modalPause').modal('hide');
                enableMovement();
                enableAnimation();
                flechasJugador.forEach(function (flecha) {
                    flecha.setVelocityX(700);
                });
                enemigos.forEach(function (orco) {
                    orco.anims.play('orcoRojo');
                });
                orcosVerdes.forEach(function (orco) {
                    orco.anims.play('orcoVerde');
                });
                monedero.forEach(function (moneda) {
                    moneda.anims.play('moneda');
                });
                await Promise.all([generarObstaculos(), generarMonedas(), sumarPuntos()]);
            }
        }, this);

        botonAjustesPausa.addEventListener('click', function () {
            if (estaVivo) {
                cargarAjustes();
                modalAMostrar = 1;
                $('#modalPause').modal('hide');
                $('#modalSettings').modal({backdrop: 'static', keyboard: false}).modal('show');
            }
        }, this);

        botonAjustesGameOver.addEventListener('click', function () {
            cargarAjustes();
            modalAMostrar = 2;
            $('#modalGameOver').modal('hide');
            $('#modalSettings').modal({backdrop: 'static', keyboard: false}).modal('show');
        }, this);

        botonAceptarAjustes.addEventListener('click', function () {
            confirmarAjustes();
        }, this);

        botonCancelarAjustes.addEventListener('click', function () {
            cancelarAjustes();
        }, this);


        puntx2.addEventListener('click', function () {
            efectoDeItemX2();
        }, this);

        antiObstaculos.addEventListener('click', function () {
            efectoDeItemInmunidad();
        }, this);

        botonSuperSalto.addEventListener('click', function () {
            efectoDeItemSuperSalto();
        }, this);

        botonRevivir.addEventListener('click', function () {
            efectoDeItemRevivir();
        }, this);

        // Teclas
        cursors = this.input.keyboard.createCursorKeys();
        if (window.matchMedia('(pointer: fine)').matches) {
            this.input.keyboard.on('keydown-SPACE', function (event) {
                if (jugador.body.touching.down && canMove) {
                    disparando = false;
                    if (flechaJugador.x === jugador.x + 30) flechaJugador.disableBody(true, true);
                    jugador.setVelocityY(alturaSalto);
                    jugador.anims.play('jump');
                    jugador.once('animationcomplete', () => {
                        jugador.anims.play('run');
                    });
                }
            });

            this.input.on('pointerdown', async function (pointer) {
                if (!disparando) {
                    if (pointer.leftButtonDown()) {
                        await dispararFlechas();
                    }
                }
            });
        } else {
            this.input.on('pointerdown', async function () {
                if (jugador.body.touching.down && canMove) {
                    disparando = false;
                    if (flechaJugador.x === jugador.x + 30) flechaJugador.disableBody(true, true);
                    jugador.setVelocityY(alturaSalto);
                    jugador.anims.play('jump');
                    jugador.once('animationcomplete', () => {
                        jugador.anims.play('run');
                    });
                }
            });

            botonDisparar.addEventListener('click', async function () {
                if (!disparando) {
                    await dispararFlechas();
                }
            }, this);
        }

        // Puntos
        txtPuntos = this.add.text(50, 30, ``, {
            fontFamily: "Turtles",
            fontSize: "30px",
            fill: colorTexto
        });

        // Hight score
        txtHightScore = this.add.text(300, 30, ``, {
            fontFamily: "Turtles",
            fontSize: "30px",
            fill: colorTexto
        });

        // Monedas
        txtMonedas = this.add.text(50, 80, ``, {
            fontFamily: "Turtles",
            fontSize: "30px",
            fill: colorTexto
        });
    }

    update() {

        if (canMove && estaVivo) {

            textoSuperSalto.textContent = cantidadSuperSalto.toString();
            textoPuntuacionx2.textContent = cantidadPuntuacionx2.toString();
            textoAntiObstaculos.textContent = cantidadAntiObstaculos.toString();
            textoRevivir.textContent = cantidadRevivir.toString();

            txtPuntos.setText("Puntos: " + puntos)
            if (puntos >= hightScore) hightScore = puntos
            txtHightScore.setText("Mejor puntuación: " + hightScore)
            txtMonedas.setText("Monedas: " + monedas)
            fondo.tilePositionX += velocidad;
            if (disparando) flechaJugador.enableBody(true, jugador.x + 30, jugador.y + 60, true, true);
            monedero.forEach(function (moneda) {
                moneda.x -= velocidad / 2; // Mover cada moneda junto con el fondo
            });
            enemigos.forEach(function (orco) {
                orco.x -= velocidad / 1.36; // Mover cada orco junto con el fondo
            });
            orcosVerdes.forEach(function (orco) {
                orco.x -= velocidad / 1.36; // Mover cada orco junto con el fondo
            });
            piedras.forEach(function (piedra) {
                piedra.x -= velocidad / 2; // Mover cada piedra junto con el fondo
            });
            plataformas.forEach(function (plataforma) {
                plataforma.x -= velocidad / 2; // Mover cada plataforma junto con el fondo
            });
            pinchos.forEach(function (pincho) {
                pincho.x -= velocidad / 2; // Mover cada pincho junto con el fondo
            });

        }
    }
}

function enableMovement() {
    // Empezar a mover el personaje
    canMove = true;
    $('#botonPausa').show();
    $('#botonAntiObstaculos').show();
    $('#botonSuperSalto').show();
    $('#botonx2').show();
    if (!window.matchMedia('(pointer: fine)').matches) $('#botonDisparar').show();
}

function enableAnimation() {
    // Reproducir la animación al iniciar el juego
    jugador.anims.play('run');
}

async function sumarPuntos() {
    //await new Promise(resolve => setTimeout(resolve, 1470));
    while (canMove && estaVivo) {
        puntos += puntosASumar;
        if (puntos % 100 === 0) velocidad += 0.85;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function dispararFlechas() {
    await new Promise(resolve => setTimeout(resolve, 150));
    if (canMove && estaVivo) {
        flechaJugador = context.physics.add.image(jugador.x, jugador.y, "flechaJugador").setScale(2.5);
        flechaJugador.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        flechaJugador.body.setAllowGravity(false);
        flechaJugador.disableBody(true, true);
        flechaJugador.setScale(2.5);
        flechaJugador.setSize(40, 10);
        disparando = true;
        flechasJugador.push(flechaJugador);
        jugador.anims.play('shot');
        jugador.once('animationcomplete', () => {
            jugador.anims.play('run');
            flechaJugador.setVelocityX(700);
            disparando = false
            if (usuario.sonido) {
                arcoSound.play();
            }

        });
    }
}

async function generarMonedas() {
    await new Promise(resolve => setTimeout(resolve, 1470));
    let i = 0;
    while (estaVivo && canMove) {
        await new Promise(resolve => setTimeout(resolve, Phaser.Math.RND.between(2000, 3000)));
        if (estaVivo && canMove) {
            let x = Phaser.Math.RND.between(game.config.width + 200, game.config.width + 500) // Posición X aleatoria dentro del ancho de la pantalla
            let y = Phaser.Math.RND.between(650, 900); // Posición Y aleatoria dentro de la altura de la pantalla
            moneda = context.physics.add.sprite(x, y, "moneda").setScale(0.5);
            moneda.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            moneda.body.setAllowGravity(false);
            moneda.anims.play('moneda');
            monedero.push(moneda);
            i++;
        }
    }
}

function cogerMonedas(jugador, moneda) {
    moneda.disableBody(true, true);// desactiva las monedas
    puntos += 10; //suma puntos
    monedas += 5; //suma monedas
    txtPuntos.setText("Puntos: " + puntos)
    if (usuario.sonido) {
        monedaSound.play();
    }
}

async function generarObstaculos() {
    await new Promise(resolve => setTimeout(resolve, 1470));
    let enemigoGenerado = 0;
    while (estaVivo && canMove) {
        if (enemigoGenerado !== 3) {
            if (enemigoGenerado === 4) {
                await new Promise(resolve => setTimeout(resolve, Phaser.Math.RND.between(3000, 3250)));
            } else {
                await new Promise(resolve => setTimeout(resolve, Phaser.Math.RND.between(2000, 2750)));
            }
        } else {
            await new Promise(resolve => setTimeout(resolve, Phaser.Math.RND.between(2750, 2750)));
        }

        if (estaVivo && canMove) {
            enemigoGenerado = Phaser.Math.RND.between(1, 4);
            if (enemigoGenerado === 1) {
                let x = Phaser.Math.RND.between(game.config.width + 500, game.config.width + 800);
                let y = Phaser.Math.RND.between(875, 875);
                if (usuario.sonido) {
                    enemigoSound.play();
                }
                orco = context.physics.add.sprite(x, y, "orcoRojo").setScale(1.75);
                orco.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                orco.setFlipX(true);
                orco.body.setSize(35, 64);
                orco.body.setOffset(22, 36);
                orco.body.setAllowGravity(false);
                orco.anims.play('orcoRojo');
                enemigos.push(orco);

                if (velocidad >= 50) {
                    orco = context.physics.add.sprite(x, y, "orcoRojo").setScale(1.75);
                    orco.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    orco.body.setSize(35, 64);
                    orco.body.setOffset(22, 36);
                    orco.body.setAllowGravity(false);
                    orco.anims.play('orcoRojo');
                    context.physics.add.collider(suelo, orco);
                    enemigos.push(orco);
                    if (velocidad >= 80) {
                        orco = context.physics.add.sprite(x, y, "orcoRojo").setScale(1.75);
                        orco.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                        orco.body.setSize(35, 64);
                        orco.body.setOffset(22, 36);
                        orco.body.setAllowGravity(false);
                        orco.anims.play('orcoRojo');
                        context.physics.add.collider(suelo, orco);
                        enemigos.push(orco);
                    }
                }
            } else if (enemigoGenerado === 2) {
                let x = Phaser.Math.RND.between(game.config.width + 500, game.config.width + 800);
                let y = Phaser.Math.RND.between(770, 770);
                if (usuario.sonido) {
                    orcoVerdeSound.play();
                }
                orcoVerde = context.physics.add.sprite(x, y, "orcoVerde").setScale(4);
                orcoVerde.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                orcoVerde.setFlipX(true);
                orcoVerde.body.setSize(35, 63);
                orcoVerde.body.setOffset(22, 36);
                orcoVerde.body.setAllowGravity(false);
                orcoVerde.anims.play('orcoVerde');
                orcosVerdes.push(orcoVerde);
            } else if (enemigoGenerado === 3) {
                let x = Phaser.Math.RND.between(game.config.width + 500, game.config.width + 800);
                let y = Phaser.Math.RND.between(890, 890);
                piedra = context.physics.add.image(x, y, "piedra").setScale(0.065);
                piedra.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                piedra.body.setSize(1950, 1850);
                piedra.body.setOffset(0, 300);
                piedra.body.setAllowGravity(false);
                context.physics.add.collider(suelo, piedra);
                piedras.push(piedra);

                if (velocidad >= 50) {
                    piedra = context.physics.add.image(x + 200, y, "piedra").setScale(0.065);
                    piedra.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    piedra.body.setSize(1950, 1850);
                    piedra.body.setOffset(0, 300);
                    piedra.body.setAllowGravity(false);
                    context.physics.add.collider(suelo, piedra);
                    piedras.push(piedra);
                    if (velocidad >= 80) {
                        piedra = context.physics.add.image(x + 400, y, "piedra").setScale(0.065);
                        piedra.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                        piedra.body.setSize(1950, 1850);
                        piedra.body.setOffset(0, 300);
                        piedra.body.setAllowGravity(false);
                        context.physics.add.collider(suelo, piedra);
                        piedras.push(piedra);
                    }
                }
            } else if (enemigoGenerado === 4) {
                let xPlataforma = Phaser.Math.RND.between(game.config.width + 500, game.config.width + 800);
                let yPlataforma = Phaser.Math.RND.between(700, 700);
                if (velocidad > 60) {
                    plataforma = context.physics.add.image(xPlataforma, yPlataforma, "plataforma").setScale(0.4, 0.2);
                } else if (velocidad > 90) {
                    plataforma = context.physics.add.image(xPlataforma, yPlataforma, "plataforma").setScale(0.5, 0.2);
                } else {
                    plataforma = context.physics.add.image(xPlataforma, yPlataforma, "plataforma").setScale(0.2);
                }
                plataforma.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                plataforma.body.setSize(1370, 200);
                plataforma.body.setOffset(0, 1150);
                plataforma.body.setAllowGravity(false);
                context.physics.add.collider(jugador, plataforma);
                plataformas.push(plataforma);

                let xPincho = xPlataforma;
                let yPincho = Phaser.Math.RND.between(920, 920);
                pincho = context.physics.add.image(xPincho, yPincho, "pincho");
                pincho.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                pincho.body.setSize(250, 85);
                pincho.body.setAllowGravity(false);
                context.physics.add.collider(suelo, pincho);
                pinchos.push(pincho);

                pincho = context.physics.add.image(xPincho - 250, yPincho, "pincho");
                pincho.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                pincho.body.setSize(250, 85);
                pincho.body.setAllowGravity(false);
                context.physics.add.collider(suelo, pincho);
                pinchos.push(pincho);

                pincho = context.physics.add.image(xPincho + 250, yPincho, "pincho");
                pincho.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                pincho.body.setSize(250, 85);
                pincho.body.setAllowGravity(false);
                context.physics.add.collider(suelo, pincho);
                pinchos.push(pincho);

                if (velocidad > 60) {
                    pincho = context.physics.add.image(xPincho - 500, yPincho, "pincho");
                    pincho.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    pincho.body.setSize(250, 85);
                    pincho.body.setAllowGravity(false);
                    context.physics.add.collider(suelo, pincho);
                    pinchos.push(pincho);

                    pincho = context.physics.add.image(xPincho + 500, yPincho, "pincho");
                    pincho.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    pincho.body.setSize(250, 85);
                    pincho.body.setAllowGravity(false);
                    context.physics.add.collider(suelo, pincho);
                    pinchos.push(pincho);

                    if (velocidad > 80) {
                        pincho = context.physics.add.image(xPincho - 750, yPincho, "pincho");
                        pincho.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                        pincho.body.setSize(250, 85);
                        pincho.body.setAllowGravity(false);
                        context.physics.add.collider(suelo, pincho);
                        pinchos.push(pincho);

                        pincho = context.physics.add.image(xPincho + 750, yPincho, "pincho");
                        pincho.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                        pincho.body.setSize(250, 85);
                        pincho.body.setAllowGravity(false);
                        context.physics.add.collider(suelo, pincho);
                        pinchos.push(pincho);
                    }
                }
            }
        }
    }
}

async function matarOrco() {
    orcoVerde.anims.play('matarOrco');
    orcoVerde.setSize(0.1, 0.1).setOffset(0, 5000);
    flechaJugador.disableBody(true, true);
    orcoVerde.setVelocityX(0);
}

async function morir() {
    if (puedeMorir) {
        if (!estaVivo) {
            return;
        }
        txtPuntos.setText("")
        txtHightScore.setText("")
        txtMonedas.setText("")
        if (usuario.sonido) {
            fondoSound.stop();
        }
        jugador.anims.stop();
        enemigos.forEach(function (orco) {
            if (orco.x <= game.config.width / 3) {
                orco.anims.play('ataqueOrcoRojo');
                /*orco.once('animationcomplete', () => {
                    orco.anims.stop();
                })*/
            }
        });
        orcosVerdes.forEach(function (orco) {
            if (orco.x <= game.config.width / 3) {
                orco.anims.play('ataqueOrcoVerde');
                /*orco.once('animationcomplete', () => {
                    orco.anims.stop();
                })*/
            }
        });
        canMove = false;
        estaVivo = false;
        jugador.setVelocity(0);
        await new Promise(resolve => setTimeout(resolve, 400));
        jugador.anims.play('dead');
        jugador.once('animationcomplete', () => {
            jugador.anims.stop();
        })
        if (usuario.sonido) {
            defeatSound.play();
            defeatSound.volume = 0.2;
        }
        document.getElementById("textoCantidadPuntos").textContent = "Puntuación: " + puntos.toString();
        document.getElementById("textoCantidadMonedas").textContent = "Monedas: " + monedas.toString();
        if (puntos >= hightScore) document.getElementById("textoHightScore").textContent = "Mejor puntuación: " + puntos.toString();
        else document.getElementById("textoHightScore").textContent = "Mejor puntuación: " + hightScore.toString();
        await new Promise(resolve => setTimeout(resolve, 1500));
        $('#modalPause').modal('hide');
        $('#modalSettings').modal('hide');
        $('#modalGameOver').modal({backdrop: 'static', keyboard: false}).modal('show');

        await actualizarPuntuacion(puntos);
        await actualizarMonedas(monedas);
        await actualizarItemsPostPartida();
    }
}

const actualizarPuntuacion = async (nuevaPuntuacion) => {
    const url = '/usuarios/puntuaciones/usuario';
    const data = {nuevaPuntuacion};

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.error);
        }

        return await response.json();
    } catch (error) {
        console.error('Hubo un error al actualizar la puntuación:', error);
        throw error;
    }
};

const actualizarMonedas = async (monedasObtenidas) => {
    const url = '/usuarios/monedas/usuario';
    const data = {monedasObtenidas};

    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.error);
        }

        return await response.json();
    } catch (error) {
        console.error('Hubo un error al actualizar la puntuación:', error);
        throw error;
    }
};

function confirmarAjustes() {
    Swal.fire({
        title: "¿Quieres guardar los ajustes?",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: "Salir sin guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "lightgreen",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await guardarAjustes();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡Ajustes guardados!",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            }).then(() => {
                $('#modalSettings').modal('hide');
                if (modalAMostrar === 1) $('#modalPause').modal({backdrop: 'static', keyboard: false}).modal('show');
                else if (modalAMostrar === 2) $('#modalGameOver').modal({
                    backdrop: 'static',
                    keyboard: false
                }).modal('show');
            })
        } else if (result.isDenied) {
            $('#modalSettings').modal('hide');
            if (modalAMostrar === 1) $('#modalPause').modal({backdrop: 'static', keyboard: false}).modal('show');
            else if (modalAMostrar === 2) $('#modalGameOver').modal({
                backdrop: 'static',
                keyboard: false
            }).modal('show');
        }

    });
}

function cancelarAjustes() {
    Swal.fire({
        title: "¿Quieres salir sin guardar los ajustes?",
        icon: "warning",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: "Salir sin guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "lightgreen",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await guardarAjustes();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡Ajustes guardados!",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            }).then(() => {
                $('#modalSettings').modal('hide');
                if (modalAMostrar === 1) $('#modalPause').modal({backdrop: 'static', keyboard: false}).modal('show');
                else if (modalAMostrar === 2) $('#modalGameOver').modal({
                    backdrop: 'static',
                    keyboard: false
                }).modal('show');
            })
        } else if (result.isDenied) {
            $('#modalSettings').modal('hide');
            if (modalAMostrar === 1) $('#modalPause').modal({backdrop: 'static', keyboard: false}).modal('show');
            else if (modalAMostrar === 2) $('#modalGameOver').modal({
                backdrop: 'static',
                keyboard: false
            }).modal('show');
        }
    });
}

async function guardarAjustes() {
    const data = {
        valorMusica: !checkboxMusica.checked,
        valorSonido: !checkboxSonido.checked,
        valorPantallaCompleta: !checkboxPantallaCompleta.checked
    };

    await fetch('/usuarios/ajustes/usuario', {
        credentials: 'include',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

async function cargarAjustes() {
    const respUsuario = await fetch('/usuarios/usuario');
    if (respUsuario.status !== 200) {
        throw new Error("Error al cargar");
    }
    let usuario = await respUsuario.json();

    checkboxMusica.checked = !usuario.musica;
    checkboxSonido.checked = !usuario.sonido;
    checkboxPantallaCompleta.checked = !usuario.pantallaCompleta;
}

async function efectoDeItemX2() {

    if (cantidadPuntuacionx2 > 0) {

        cantidadPuntuacionx2--;
        puntosASumar = 2;
        let x = 15;
        while (x >= 0) {
            if (x <= 3) contadorTiempoPuntuacionx2.style.color = "red"
            contadorTiempoPuntuacionx2.textContent = x + "s";
            await new Promise(resolve => setTimeout(resolve, 1000));
            x--;
        }
        contadorTiempoPuntuacionx2.textContent = "";
        puntosASumar = 1;
    }
}

async function efectoDeItemSuperSalto() {

    if (cantidadSuperSalto > 0) {
        cantidadSuperSalto--;
        alturaSalto = -1000;
        let x = 15;
        while (x >= 0) {
            if (x <= 3) contadorTiempoSuperSalto.style.color = "red"
            contadorTiempoSuperSalto.textContent = x + "s";
            await new Promise(resolve => setTimeout(resolve, 1000));
            x--;
        }
        contadorTiempoSuperSalto.textContent = "";
        alturaSalto = -725;
    }
}

async function efectoDeItemInmunidad() {

    if (cantidadAntiObstaculos > 0) {
        cantidadAntiObstaculos--;
        puedeMorir = false;
        let x = 15;
        while (x >= 0) {
            if (x <= 3) contadorTiempoAntiObstaculos.style.color = "red"
            contadorTiempoAntiObstaculos.textContent = x + "s";
            await new Promise(resolve => setTimeout(resolve, 1000));
            x--;
        }
        contadorTiempoAntiObstaculos.textContent = "";
        puedeMorir = true;
    }
}

async function efectoDeItemRevivir() {

    if (cantidadRevivir > 0) {
        Swal.fire({
            title: "¿Quieres gastar una vida?",
            icon: "question",
            showDenyButton: true,
            confirmButtonText: "Sí",
            denyButtonText: "No",
            confirmButtonColor: "lightgreen",
        }).then(async (result) => {
            if (result.isConfirmed) {
                cantidadRevivir--;
                $('#modalGameOver').modal('hide');

                jugador.anims.play('revivir');
                jugador.once('animationcomplete', async () => {
                    jugador.anims.play('run');
                    puedeMorir = false;
                    canMove = true;
                    estaVivo = true;
                    await Promise.all([generarObstaculos(), generarMonedas(), sumarPuntos()]);
                });

                let x = 6;
                while (x >= 0) {
                    if (x <= 3) contadorTiempoAntiObstaculos.style.color = "red"
                    contadorTiempoAntiObstaculos.textContent = x + "s";
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    x--;
                }
                contadorTiempoAntiObstaculos.textContent = "";
                puedeMorir = true;
            }
        });
    } else {
        Swal.fire({
            icon: "warning",
            title: "No te quedan vidas",
            text: "¡Compra vidas en la tienda para poder revivir después de una partida!",
            confirmButtonText: "De acuerdo"
        });
    }
}

async function actualizarItemsPostPartida() {
    console.log(cantidadSuperSalto);
    console.log(cantidadPuntuacionx2);
    console.log(cantidadAntiObstaculos);
    console.log(cantidadRevivir);
    const data = {
        cantidadSuperSalto,
        cantidadPuntuacionx2,
        cantidadAntiObstaculos,
        cantidadRevivir
    };

    await fetch('/usuarios/postpartida/items/usuario', {
        credentials: 'include',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}


