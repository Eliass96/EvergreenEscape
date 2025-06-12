const bcrypt = require('bcryptjs');
require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const bcryptjs = require("bcryptjs");
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(); // no pongas el clientId aquí
const jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');

//PINGS
const redis = require('redis');
const {RedisStore} = require('connect-redis');
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        tls: true
    }
});
redisClient.connect().catch(err => console.error('Error al conectar a Redis:', err));

setInterval(async () => {
    try {
        await redisClient.ping();
        console.log("Ping enviado a Redis");
    } catch (err) {
        console.error("Error al hacer ping a Redis:", err);
    }
}, 300000);


//VARIABLES
const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const PORT = process.env.PORT || 40000;
const app = express();

let datosGoogle = null;
let isNewUser;
let isRegister = true;

//STORAGE DE IMÁGENES
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'www/uploads/');
    },
    filename: function (req, file, cb) {
        const nombreUnico = Date.now() + '-' + file.originalname;
        cb(null, nombreUnico);
    }
});
const upload = multer({storage: storage});


function bloquearAccesoDirecto(req, res, next) {
    const referer = req.get('Referer');
    const origin = req.get('Origin');

    if (!referer && !origin) {
        return res.status(403).sendFile(path.join(__dirname, "../www/html/errors/404.html"));
    }

    if (referer && !referer.startsWith('http://localhost:30000') && !referer.startsWith('https://evergreenescape.onrender.com/')) {
        return res.status(403).sendFile(path.join(__dirname, "../www/html/errors/404.html"));
    }
    next();
}

//TODOS LOS USE
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: 'EvergreenEscapeSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 86400000
    }
}));

app.use('/js', bloquearAccesoDirecto);
app.use('/css', bloquearAccesoDirecto);
app.use('/html', bloquearAccesoDirecto);
app.use('/assets', bloquearAccesoDirecto);
app.use('/pug', bloquearAccesoDirecto);
app.use('/img', bloquearAccesoDirecto);
app.use('/apiPaises.json', bloquearAccesoDirecto);
app.use('/apiPaisesTraducida.json', bloquearAccesoDirecto);
app.use('/index.html', bloquearAccesoDirecto);

app.use(passport.initialize());
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(cors());
app.use(express.static("www"));
db.conectar().then(async () => {
    console.log("Conectado con la base de datos.");
    app.listen(PORT, () =>
        console.log("Servicio escuchando en el puerto " + PORT)
    );
    await db.agregarObjetos();
});

// RUTAS
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/register.html"));
});

app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/profile.html"));
});

app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/game.html"));
});

app.get("/info", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/info.html"));
});

app.get("/shop", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/shop.html"));
});

app.get("/rankings", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/rankings.html"));
});

app.get("/settings", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/settings.html"));
});

app.get("/gameSettings", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/gameSettings.html"));
});

app.get("/completeData", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/completeData.html"));
});

app.get("/friends", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/friends.html"));
});

app.get("/battlePass", (req, res) => {
    res.sendFile(path.join(__dirname, "../www/html/battlePass.html"));
});

// METODOS
// ESTRATEGIA GMAIL
passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_WEB_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
        datosGoogle = {
            email: profile._json.email,
            password: profile._json.sub,
            provider: profile.provider
        };
        cb(null, profile);
    }));

const authenticateGoogle = (req, res, next) => {
    passport.authenticate('google', {session: false}, (err, user) => {
        if (err || !user) {
            return res.status(403).json({success: false, message: 'Autenticación fallida'});
        }
        req.user = user;
        return next();
    })(req, res, next);
};

// RUTA PARA INICIAR AUTENTICACIÓN (Web)
app.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));

// CALLBACK AUTENTICACIÓN GOOGLE
app.get('/passport/google/callback',
    authenticateGoogle,
    (req, res) => {
        console.log("✅ Autenticado como:", req.user.displayName);

        if (isNewUser) {
            return res.redirect("/completeData");
        } else if (!isRegister) {
            return res.sendFile(path.join(__dirname, '..', 'www', 'html', 'redirectRegister.html'));
        } else {
            isRegister = true;
            return res.sendFile(path.join(__dirname, '..', 'www', 'html', 'redirectLogin.html'));
        }
    }
);

app.post('/auth/google', async (req, res) => {
    const {idToken} = req.body;

    if (!idToken) {
        return res.status(400).json({success: false, message: 'Falta idToken'});
    }

    try {
        // Verificar el idToken y validar audiencia
        const ticket = await client.verifyIdToken({
            idToken,
            audience: [
                process.env.GOOGLE_WEB_CLIENT_ID,
                process.env.GOOGLE_ANDROID_CLIENT_ID
            ],
        });

        const payload = ticket.getPayload();

        // Decodificar sin verificar para obtener aud
        const decodedPayload = jwt.decode(idToken);
        const aud = decodedPayload.aud;

        console.log("🔍 AUDIENCE (aud) del idToken:", aud);

        // Validar origen
        const isFromAndroid = aud === process.env.GOOGLE_ANDROID_CLIENT_ID || aud === process.env.GOOGLE_ANDROID_CLIENT_ID_ALT;
        const isFromWeb = aud === process.env.GOOGLE_WEB_CLIENT_ID;

        if (!isFromAndroid && !isFromWeb) {
            return res.status(403).json({success: false, message: "Origen de token no permitido"});
        }

        // Aquí pondrías tu lógica real para saber si el usuario es nuevo o está registrado
        // Por ejemplo, buscar el email en la base de datos:
        let isNewUser = false; // placeholder
        let isRegister = false; // placeholder

        // Simulación o llamada a tu DB
        // const user = await db.findUserByEmail(payload.email);
        // if (!user) isNewUser = true;
        // else isRegister = user.isRegistered;

        // Ajusta la lógica según tu sistema:
        if (isNewUser) {
            if (isFromWeb) {
                return res.redirect("/completeData");
            } else {
                // Para Android/webview podrías responder con un JSON indicando nextStep
                return res.status(200).json({
                    success: true,
                    nextStep: "completeData",
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                    origin: isFromAndroid ? "android" : "web"
                });
            }
        } else if (!isRegister) {
            if (isFromWeb) {
                return res.sendFile(path.join(__dirname, '..', 'www', 'html', 'redirectRegister.html'));
            } else {
                return res.status(200).json({
                    success: true,
                    nextStep: "register",
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                    origin: isFromAndroid ? "android" : "web"
                });
            }
        } else {
            isRegister = true;
            if (isFromWeb) {
                return res.sendFile(path.join(__dirname, '..', 'www', 'html', 'redirectLogin.html'));
            } else {
                // Generar token JWT para sesión
                const sessionToken = jwt.sign(
                    {
                        email: payload.email,
                        name: payload.name,
                        picture: payload.picture,
                        origin: isFromAndroid ? "android" : "web"
                    },
                    process.env.JWT_SECRET,
                    {expiresIn: '1h'}
                );

                return res.status(200).json({
                    success: true,
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                    origin: isFromAndroid ? "android" : "web",
                    token: sessionToken
                });
            }
        }

    } catch (err) {
        console.error("❌ Error verificando idToken:", err);
        res.status(401).json({success: false, message: 'Token inválido o clientId incorrecto'});
    }
});


app.patch('/usuarios/enviarMensaje', async (req, res) => {
    const {fromUser, toUser, contenidoMensaje} = req.body;
    console.log(req.body)

    if (!fromUser || !toUser || !contenidoMensaje) {
        return res.status(400).json({success: false, message: 'Faltan parámetros necesarios'});
    }

    try {
        const result = await db.enviarMensaje(fromUser, toUser, contenidoMensaje);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
});

app.get('/conversacion/:usuarioA/:usuarioB', async (req, res) => {
    const {usuarioA, usuarioB} = req.params;
    try {
        const mensajes = await db.obtenerConversacion(usuarioA, usuarioB);
        return res.status(200).json(mensajes);
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
});

// COMPROBACIÓN DE SESIÓN
app.get('/usuarios/estado', async (req, res) => {
    try {
        if (req.session) {
            const usuarioId = req.session.usuario;
            const usuario = await db.getUsuario(usuarioId);
            if (usuario) {
                let usuarioId = usuario._id

                res.status(HTTP_OK).send({estadoSesion: 'activa', usuarioId});
            } else {
                req.session.destroy();
                res.status(HTTP_UNAUTHORIZED).send({message: 'No has iniciado sesión'});
            }
        } else {
            res.status(HTTP_UNAUTHORIZED).send({message: 'No has iniciado sesión'});
        }
    } catch (error) {
        res.status(HTTP_UNAUTHORIZED).send({message: 'No has iniciado sesión'});
    }
});

//COMPLETAR DATOS
app.post("/usuarios/completarDatos", async (req, res) => {
    try {
        const nombre = req.body.nombre;
        const password = datosGoogle.password;
        const nacionalidad = req.body.nacionalidad;
        const email = datosGoogle.email;
        if (!nombre || !password || !nacionalidad || !email) {
            return res.status(HTTP_BAD_REQUEST).send({status: "Error", message: "Los campos están incompletos"})
        }

        const usuarioAResvisar = await db.existeUsuario(email);
        if (!usuarioAResvisar) {
            const salt = await bcrypt.genSalt(5);
            const hashPassword = await bcrypt.hash(password, salt);
            const nuevoUsuario = {
                nombre, email, password: hashPassword, nacionalidad
            }
            await db.altaUsuario(nuevoUsuario);

            return res.status(HTTP_CREATED).send({status: "ok", message: `Usuario ${nuevoUsuario.nombre} registrado`})
        } else {
            return res.status(HTTP_CONFLICT).send({status: "Error", message: "Este usuario ya existe"});
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({message: 'Error inesperado al registrarte.', error: err.message});
    }
});

// REGISTRO
app.post("/usuarios/registro", async (req, res) => {
    try {
        const {nombre, password, nacionalidad, email} = req.body;

        if (!nombre?.trim() || !password?.trim() || !nacionalidad?.trim() || !email?.trim()) {
            return res.status(HTTP_BAD_REQUEST).json({status: "Error", message: "Los campos están incompletos"});
        }

        const usuarioExistente = await db.existeUsuario(email.trim(), nombre.trim());
        if (usuarioExistente) {
            return res.status(HTTP_CONFLICT).json({status: "Error", message: "Este usuario ya existe"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = {
            nombre: nombre.trim(),
            email: email.trim(),
            password: hashPassword,
            nacionalidad: nacionalidad.trim()
        };

        await db.altaUsuario(nuevoUsuario);
        return res.status(HTTP_CREATED).json({
            status: "ok",
            message: `Usuario ${nuevoUsuario.nombre} registrado exitosamente`
        });

    } catch (err) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            status: "Error",
            message: "Error inesperado al registrarte",
            error: err.message
        });
    }
});

// INICIO DE SESIÓN
app.post("/usuarios/logueo", async (req, res) => {
    try {
        let email;
        let password;
        let provider;

        if (datosGoogle) {
            email = datosGoogle.email;
            password = datosGoogle.password;
            provider = datosGoogle.provider;
        } else {
            email = req.body.email;
            password = req.body.password;
            provider = "normal";
        }

        if (!email || !password) {
            return res.status(HTTP_BAD_REQUEST).send({status: "Error", message: "Los campos están incompletos"});
        }

        const usuarioAResvisar = await db.existeUsuario(email);
        if (!usuarioAResvisar) {
            return res.status(HTTP_UNAUTHORIZED).send({
                status: "Error",
                message: "El usuario no existe",
                provider: provider
            });
        }

        const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
        if (!loginCorrecto) {
            return res.status(HTTP_FORBIDDEN).send({status: "Error", message: "Contraseña incorrecta"});
        }

        req.session.usuario = usuarioAResvisar._id.toString();

        isNewUser = false;
        isRegister = false;
        datosGoogle = null;
        return res
            .location(`/usuarios/${usuarioAResvisar._id}`)
            .status(HTTP_OK)
            .send({usuario: usuarioAResvisar, mensaje: "Usuario logueado."});

    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error inesperado al iniciar sesión.',
            error: err.message
        });
    }
});

// CERRAR SESIÓN
app.get('/usuarios/cerrarSesion', async (req, res) => {
    try {
        if (req.session) {
            req.session.destroy();
            res.status(HTTP_OK).send({message: 'Sesión cerrada'});
        } else {
            res.status(HTTP_UNAUTHORIZED).send({message: 'No has iniciado sesión.'});
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error inesperado al cerrar sesión.',
            error: err.message
        });
    }
});

// GET DE USUARIOS
app.get("/usuarios", async function (req, res) { // funciona
    try {
        let usuariosEncontrados = await db.listarTodosLosUsuarios();
        res.status(HTTP_OK).send(usuariosEncontrados);
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({message: 'Error al listar los usuarios.', error: err.message});
    }
});

// GET DE USUARIO LOGUEADO
app.get("/usuarios/usuario", async function (req, res) { // funciona
    try {
        const userId = req.session.usuario;
        if (userId) {
            let usuarioEncontrado = await db.getUsuario(userId);
            res.status(HTTP_OK).send(usuarioEncontrado);
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'No hay ninguna sesión iniciada.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({message: 'Error al buscar el usuario.', error: err.message});
    }
});

// CAMBIAR FOTO DE PERFIL
app.post("/usuarios/usuario/cambiarAvatar", upload.single('foto'), async function (req, res) {
    try {
        const idUsuario = req.session.usuario;
        const archivo = req.file;

        if (!idUsuario) {
            return res.status(HTTP_NOT_FOUND).json({message: 'No hay sesión iniciada para cambiar la foto.'});
        }

        if (!archivo || !archivo.mimetype.startsWith('image/')) {
            return res.status(HTTP_BAD_REQUEST).json({message: 'No se ha recibido una imagen válida.'});
        }

        const usuario = await db.getUsuario(idUsuario);
        const fotoAntigua = usuario?.avatar;

        if (fotoAntigua && fotoAntigua !== "default.jpg") {
            const rutaAntigua = path.join('www', 'uploads', fotoAntigua);
            fs.unlink(rutaAntigua, (err) => {
                if (err) {
                    console.error("Error al borrar la imagen antigua:", err.message);
                } else {
                    console.log(`Imagen antigua eliminada: ${fotoAntigua}`);
                }
            });
        }

        const resultado = await db.actualizarFotoPerfil(idUsuario, archivo.filename);

        if (resultado.modifiedCount === 1) {
            return res.status(HTTP_OK).json({
                message: 'Foto de perfil actualizada con éxito',
                nombreArchivo: archivo.filename,
                url: `/uploads/${archivo.filename}`
            });
        } else {
            return res.status(HTTP_INTERNAL_SERVER_ERROR).json({message: 'No se pudo actualizar la foto de perfil.'});
        }

    } catch (err) {
        console.error(err);
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            message: 'Error al intentar cambiar la foto de perfil.',
            error: err.message
        });
    }
});

// LISTAR LAS MEJORES PUNTUACIONES DEL USUARIO
app.get("/usuarios/usuario/puntuaciones", async function (req, res) { // funciona
    try {
        const idUsuario = req.session.usuario;
        if (idUsuario) {
            let usuarioEncontrado = await db.listarPuntuaciones(idUsuario);
            res.status(HTTP_OK).send(usuarioEncontrado);
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'No se pueden listar las puntuaciones porque no hay ninguna sesión iniciada.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error al listar las puntuaciones.',
            error: err.message
        });
    }
});

// LISTAR LAS PUNTUACIONES POR PAIS
app.get("/usuarios/puntuaciones/:nacionalidad", async function (req, res) {
    try {
        const pais = req.params.nacionalidad;
        if (pais) {
            const paisDec = decodeURIComponent(pais);
            let puntuacionesPorPais = await db.listarPuntuacionesPorPais(paisDec);
            res.status(HTTP_OK).send(puntuacionesPorPais);
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'No se ha podido encontrar el país.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error al listar las puntuaciones por país.',
            error: err.message
        });
    }
});

// LISTAR LAS PUNTUACIONES DE AMIGOS
app.get("/usuarios/puntuacionesAmigos", async function (req, res) {
    try {
        let userId = req.session.usuario;
        if (userId) {
            let puntuacionesDeAmigos = await db.listarPuntuacionesDeAmigos(userId);
            res.status(HTTP_OK).send(puntuacionesDeAmigos);
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'No se has podido encontrar los amigos.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error al listar las puntuaciones de amigos.',
            error: err.message
        });
    }
});

// LISTAR TODAS LAS PUNTUACIONES
app.get("/usuarios/puntuaciones", async function (req, res) {
    try {
        const todasLasPuntuaciones = await db.listarTodasLasPuntuaciones();
        res.status(HTTP_OK).send(todasLasPuntuaciones);
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error inesperado al listar todas las puntuaciones.',
            error: err.message
        });
    }
});

// AGREGAR PUNTUACION
app.patch('/usuarios/usuario/nuevaPuntuacion', async (req, res) => { //funciona
    try {
        let userId = req.session.usuario;

        if (userId != null) {
            const {nuevaPuntuacion} = req.body;
            if (nuevaPuntuacion != null) {
                const usuarioActualizado = await db.agregarPuntuacion(userId, nuevaPuntuacion);
                res.status(HTTP_OK).json(usuarioActualizado);
            } else {
                res.status(HTTP_NOT_FOUND).json({message: 'La puntuación que se intenta añadir es inválida.'})
            }
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'No se puede agregar una puntuación porque no hay ninguna sesión iniciada.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error inesperado al agregar la nueva puntuación.',
            error: err.message
        });
    }
});

//COMPRAR ITEMS
app.patch('/usuarios/usuario/items', async (req, res) => { //funciona
    try {
        const userId = req.session.usuario;
        if (userId) {
            const {objetoId, cantidadComprada} = req.body;
            if (objetoId != null) {
                if (cantidadComprada != null && cantidadComprada > 0) {
                    const usuarioActualizado = await db.comprarItems(userId, objetoId, cantidadComprada);
                    res.status(HTTP_OK).json(usuarioActualizado);
                } else {
                    res.status(HTTP_NOT_FOUND).json({message: 'La cantidad mínima a comprar es de un objeto.'})
                }
            } else {
                res.status(HTTP_NOT_FOUND).json({message: 'No se ha podido encontrar el objeto introducido.'})
            }
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'No se pueden actualizar los objetos porque no hay ninguna sesión iniciada.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error al comprar los objetos.',
            error: err.message
        });
    }
});

// GUARDAR OBJETOS DESPUÉS DE LA PARTIDA
app.patch('/usuarios/usuario/itemsDespuesDePartida', async (req, res) => { //funciona
    try {
        const userId = req.session.usuario;
        if (userId) {
            const {
                cantidadSuperSalto,
                cantidadPuntuacionx2,
                cantidadAntiObstaculos,
                cantidadRevivir
            } = req.body;
            if (cantidadSuperSalto != null &&
                cantidadPuntuacionx2 != null &&
                cantidadAntiObstaculos != null &&
                cantidadRevivir != null
            ) {
                const usuarioActualizado = await db.utilizarItems(
                    userId,
                    cantidadSuperSalto,
                    cantidadPuntuacionx2,
                    cantidadAntiObstaculos,
                    cantidadRevivir);
                res.status(HTTP_OK).json(usuarioActualizado);
            } else {
                res.status(HTTP_NOT_FOUND).json({message: 'No se han podido actualizar los objetos porque uno o más de ellos son inválidos.'})
            }
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'No se pueden actualizar los objetos porque no hay ninguna sesión iniciada.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error al actualizar los objetos.',
            error: err.message
        });
    }
});

//PATCH A MONEDAS
app.patch('/usuarios/usuario/monedas', async (req, res) => { //funciona
    try {
        const userId = req.session.usuario;
        if (userId) {
            const {monedasObtenidas} = req.body;
            if (monedasObtenidas != null && monedasObtenidas >= 0) {
                const usuarioActualizado = await db.sumarMonedas(userId, monedasObtenidas);
                res.status(HTTP_OK).json(usuarioActualizado);
            } else {
                res.status(HTTP_NOT_FOUND).json({message: 'La cantidad de monedas obtenidas debe ser cero o más.'})
            }
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'No se pueden sumar las monedas porque no hay ninguna sesión iniciada.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error al sumar las monedas.',
            error: err.message
        });
    }
});

//CAMBIAR AJUSTES
app.patch('/usuarios/usuario/ajustes', async (req, res) => { //funciona
    try {
        const userId = req.session.usuario;
        if (userId) {
            const {valorMusica, valorSonido} = req.body;
            if (valorMusica != null &&
                valorSonido != null
            ) {
                const usuarioActualizado = await db.cambiarAjustes(userId, valorMusica, valorSonido);
                res.status(HTTP_OK).json(usuarioActualizado);
            } else {
                res.status(HTTP_NOT_FOUND).json({message: 'No se han podido actualizar los ajustes porque una o más opciones son inválidas.'})
            }
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'No se pueden cambiar los ajustes porque no hay ninguna sesión iniciada.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error al cambiar los ajustes.',
            error: err.message
        });
    }
});

// GUARDAR FONDO DE PARTIDA
app.patch('/usuarios/usuario/fondoPartida', async (req, res) => { //funciona
    try {
        const userId = req.session.usuario;
        if (userId) {
            const {fondoJuego} = req.body;
            if (fondoJuego != null) {
                const usuarioActualizado = await db.guardarFondo(userId, fondoJuego);
                res.status(HTTP_OK).json(usuarioActualizado);
            } else {
                res.status(HTTP_NOT_FOUND).json({message: 'No se ha podido cambiar el fondo porque la opción elegida es inválida.'})
            }
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'No se pueden cambiar el fondo porque no hay ninguna sesión iniciada.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error al cambiar el fondo.',
            error: err.message
        });
    }
});

// CARGAR OBJETOS DE LA TIENDA
app.get("/tienda/objeto/:nombreObjeto", async function (req, res) { // funciona
    try {
        let nombreObjeto = req.params.nombreObjeto;
        if (nombreObjeto != null) {
            let nombre;
            if (nombreObjeto === "superSalto") nombre = "Super salto"
            if (nombreObjeto === "puntuacionX2") nombre = "Puntuacion x2"
            if (nombreObjeto === "inmunidad") nombre = "Inmunidad"
            if (nombreObjeto === "revivir") nombre = "Revivir"
            let objetoEncontrado = await db.getObjeto(nombre);
            if (objetoEncontrado != null) res.status(HTTP_OK).send(objetoEncontrado);
            else res.status(HTTP_OK).json({message: 'No se ha encontrado ningún objeto con el nombre introducido.'})
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'El nombre introducido es inválido.'})
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
            message: 'Error al cargar los objetos de la tienda.',
            error: err.message
        });
    }
});

// ENVIAR SOLICITUD DE AMISTAD
app.patch("/usuarios/solicitudes/:amigoNombre", async (req, res) => {
    try {
        const usuarioId = req.session?.usuario;
        const amigoNombre = req.params.amigoNombre;
        let amigo = await db.getUsuarioByName(amigoNombre);

        if (!usuarioId) {
            return res.status(HTTP_UNAUTHORIZED).json({success: false, message: "Usuario no autenticado"});
        }

        let usuario = await db.getUsuario(usuarioId)

        if (amigo.solicitudesAmistad.includes(usuario.nombre) || amigo.amigos.includes(usuario.nombre) || amigoNombre === usuario.nombre) {
            return res.status(HTTP_CONFLICT).json({message: 'Ya se ha enviado una solicitud a ese usuario o ya es tu amigo.'})
        }

        const resultado = await db.agregarSolicitud(amigoNombre, usuarioId);
        console.log(resultado)

        return res.status(resultado.success ? HTTP_OK : HTTP_BAD_REQUEST).json(resultado);
    } catch (error) {
        console.error("❌ Error al enviar solicitud de amistad", error);
        res.status(500).json({success: false, message: "Error interno del servidor"});
    }
});

// RECHAZAR SOLICITUD DE AMISTAD
app.patch("/usuarios/solicitudes/rechazar/:amigoNombre", async (req, res) => {
    try {
        const usuarioId = req.session?.usuario;
        const amigoNombre = req.params.amigoNombre;

        if (!usuarioId) {
            return res.status(HTTP_UNAUTHORIZED).json({success: false, message: "Usuario no autenticado"});
        }

        const resultado = await db.rechazarSolicitud(amigoNombre, usuarioId);
        res.status(resultado.success ? HTTP_OK : HTTP_BAD_REQUEST).json(resultado);
    } catch (error) {
        console.error("❌ Error al rechazar solicitud de amistad", error);
        res.status(500).json({success: false, message: "Error interno del servidor"});
    }
});

// AGREGAR AMIGO
app.patch("/usuarios/amigos/agregar/:amigoId", async (req, res) => {
    try {
        const usuarioId = req.session?.usuario;
        const amigoId = req.params.amigoId;

        if (!usuarioId) {
            return res.status(401).json({success: false, message: "Usuario no autenticado"});
        }

        const resultado = await db.agregarAmigo(usuarioId, amigoId);
        res.status(resultado.success ? HTTP_OK : HTTP_BAD_REQUEST).json(resultado);
    } catch (error) {
        console.error("❌ Error al agregar amigo", error);
        res.status(500).json({success: false, message: "Error interno del servidor"});
    }
});

// ELIMINAR AMIGO
app.patch("/usuarios/amigos/eliminar/:amigoNombre", async (req, res) => {
    try {
        const usuarioId = req.session?.usuario;
        const amigoNombre = req.params.amigoNombre;

        if (!usuarioId) {
            return res.status(HTTP_UNAUTHORIZED).json({success: false, message: "Usuario no autenticado"});
        }

        const resultado = await db.eliminarAmigo(usuarioId, amigoNombre);
        res.status(resultado.success ? HTTP_OK : HTTP_BAD_REQUEST).json(resultado);
    } catch (error) {
        console.error("❌ Error al eliminar amigo", error);
        res.status(500).json({success: false, message: "Error interno del servidor"});
    }
});

//SUMAR EXPERIENCIA
app.patch('/usuarios/usuario/sumarExperiencia', async (req, res) => {
    try {
        const userId = req.session.usuario;
        const {experiencia} = req.body;
        console.log(experiencia)

        if (!userId) {
            return res.status(HTTP_UNAUTHORIZED).json({message: 'No hay sesión iniciada.'});
        }

        if (typeof experiencia !== 'number' || experiencia <= 0) {
            return res.status(HTTP_BAD_REQUEST).json({message: 'La experiencia debe ser un número positivo.'});
        }

        const resultado = await db.sumarExperiencia(userId, experiencia);

        if (resultado) {
            return res.status(HTTP_OK).json({message: 'Experiencia sumada correctamente.'});
        } else {
            return res.status(HTTP_INTERNAL_SERVER_ERROR).json({message: 'No se pudo actualizar la experiencia.'});
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({
            message: 'Error inesperado al sumar experiencia.',
            error: err.message
        });
    }
});

app.post('/reclamar-recompensa', async (req, res) => {
    const {userId, recompensaNombre, recompensaTipo, cantidad} = req.body;

    if (!userId || !recompensaNombre || !recompensaTipo || typeof cantidad !== 'number') {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos requeridos o cantidad inválida'
        });
    }

    try {
        const resultado = await db.reclamarRecompensa(userId, recompensaNombre, recompensaTipo, cantidad);
        res.status(resultado.success ? 200 : 400).json(resultado);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + err.message
        });
    }
});

// RUTA DE ERROR 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "../www/html/errors/404.html"));
});
