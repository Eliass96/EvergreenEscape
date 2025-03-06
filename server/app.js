const bcrypt = require('bcryptjs');
require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const bcryptjs = require("bcryptjs");
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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


//gmail
app.use(passport.initialize());

passport.use(new GoogleStrategy({
        clientID: "334334512703-j8nndfmflrriiadtc2iuil9kbnvmktse.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/passport/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
        console.log("Access Token: ", accessToken);
        //console.log("Refresh Token: ", refreshToken);
        cb(null, profile);
        datosGoogle = {
            email: profile._json.email,
            password: profile._json.sub,
            provider: profile.provider
        };
        //console.log(profile);
    }
));

app.get("/auth/google", passport.authenticate('google', {scope: ["profile", "email"]}));

let isNewUser;
app.get('/passport/google/callback',
    passport.authenticate("google", { session: false }),
    (req, res) => {
        if (isNewUser) {
            res.redirect("/html/completeData.html");
        } else {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <title>Redirigiendo...</title>
                </head>
                <body>
                  <script>
                    fetch('/usuarios/logueo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ provider: 'google' }) // Puedes enviar más datos si es necesario
                    })
                    .then(response => {
                        if (response.ok) {
                            window.location.href = '/';
                        } else {
                            window.location.href = '/html/completeData.html';
                            console.error('Error en el inicio de sesión');
                        }
                    })
                    .catch(error => console.error('Error en la solicitud:', error));
                  </script>
                </body>
                </html>
            `);
        }
    }
);



//hola
app.use(session({
    secret: 'EvergreenEscapeSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 86400000
    }
}));

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


//METODOS
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
            datosGoogle = null;
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
        const nombre = req.body.nombre;
        const password = req.body.password;
        const nacionalidad = req.body.nacionalidad;
        const email = req.body.email;
        if (!nombre || !password || !nacionalidad || !email) {
            return res.status(HTTP_BAD_REQUEST).send({status: "Error", message: "Los campos están incompletos"})
        }

        const usuarioAResvisar = await db.existeUsuario(nombre);
        if (!usuarioAResvisar) {
            const salt = await bcrypt.genSalt(5);
            const hashPassword = await bcrypt.hash(password, salt);
            const nuevoUsuario = {
                nombre, email, password: hashPassword, nacionalidad
            }
            await db.altaUsuario(nuevoUsuario);
            isNewUser=true;
            datosGoogle=null;
            return res.status(HTTP_CREATED).send({status: "ok", message: `Usuario ${nuevoUsuario.nombre} registrado`})
        } else {
            return res.status(HTTP_CONFLICT).send({status: "Error", message: "Este usuario ya existe"});
        }
    } catch (err) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({message: 'Error inesperado al registrarte.', error: err.message});
    }
});

// INICIO DE SESIÓN
app.post("/usuarios/logueo", async (req, res) => {
    try {
        let email;
        let password;
        let provider;

        if (datosGoogle!==null) {
            email = datosGoogle.email;
            password = datosGoogle.password;
            provider = datosGoogle.provider;

        } else {
            email = req.body.email;
            password = req.body.password;
            provider = "normal";
        }
        console.log(datosGoogle);
        if (!email || !password) {
            return res.status(HTTP_BAD_REQUEST).send({status: "Error", message: "Los campos están incompletos"});
        }

        const usuarioAResvisar = await db.existeUsuario(email);

        if (!usuarioAResvisar) {
            return res.status(HTTP_UNAUTHORIZED).send({
                status: "Error",
                message: "El usuario no existe",
                provider: provider  // "google" o "normal"
            });
        }

        const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
        if (!loginCorrecto) {
            return res.status(HTTP_FORBIDDEN).send({status: "Error", message: "Contraseña incorrecta"});
        }

        req.session.usuario = usuarioAResvisar._id.toString();

        isNewUser=false;
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