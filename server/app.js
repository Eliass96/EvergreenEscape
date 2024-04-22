const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const session = require('express-session');

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const PORT = process.env.PORT || 40000;

const app = express();
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
app.use(cookieParser())
app.use(express.static("www"));
db.conectar().then(() => {
    console.log("Conectado con la base de datos.");
    app.listen(PORT, () =>
        console.log("Servicio escuchando en el puerto " + PORT)
    );
});

// INICIO DE SESIÓN Y REGISTRO
app.get('/usuarios/sesion/estado', async (req, res) => {
    if (req.session) {
        const usuarioId = req.session.usuario; // Obtener ID del usuario de la sesión
        const usuario = await db.getUsuario(usuarioId); // Buscar usuario en la base de datos
        if (usuario) {
            // Usuario encontrado y sesión válida
            res.status(HTTP_OK).send({estadoSesion: 'activa', usuario});
        } else {
            // Usuario no encontrado o información no válida
            req.session.destroy(); // Destruir sesión
            res.status(401).send({message: 'No estás logueado'});
        }
    } else {
        // Sesión no existente
        res.status(401).send({message: 'No estás logueado'});
    }
});

app.post('/usuarios/cerarSesion', async (req, res) => {
    if (req.session) {
        req.session.destroy(); // Destruir sesión
        res.status(HTTP_OK).send({message: 'Sesión cerrada'});
    } else {
        // Sesión no existente
        res.status(401).send({message: 'No estás logueado'});
    }
});


//METODOS
// GET DE USUARIOS
app.get("/usuarios", async function (req, resp) { // funciona
    try {
        let usuariosEncontrados = await db.listarTodosLosUsuarios();
        resp.status(HTTP_OK).send(usuariosEncontrados);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

// GET DE USUARIO LOGUEADO
app.get("/usuarios/usuario", async function (req, resp) { // funciona
    try {
        const userId = req.session.usuario;
        let usuarioEncontrado = await db.getUsuario(idUsuario);
        resp.status(HTTP_OK).send(usuarioEncontrado);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

app.get("/usuarios/:id/puntuaciones", async function (req, resp) { // funciona
    try {
        const idUsuario = req.params.id;
        let usuarioEncontrado = await db.listarPuntuaciones(idUsuario);
        resp.status(HTTP_OK).send(usuarioEncontrado);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

app.get("/puntuaciones/pais/:id", async function (req, resp) {
    try {
        const pais = req.params.id;
        const paisDec = decodeURIComponent(pais);
        let puntuacionesPorPais = await db.listarPuntuacionesPorPais(paisDec);
        resp.status(HTTP_OK).send(puntuacionesPorPais);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

app.get("/puntuaciones", async function (req, resp) {
    try {
        const todasLasPuntuaciones = await db.listarTodasLasPuntuaciones();
        resp.status(HTTP_OK).send(todasLasPuntuaciones);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

// PATCH PUNTUACION
app.patch('/usuarios/puntuaciones/:id', async (req, res) => { //funciona
    const userId = req.params.id;
    const {nuevaPuntuacion} = req.body;

    try {
        const usuarioActualizado = await db.agregarPuntuacion(userId, nuevaPuntuacion);
        res.status(HTTP_OK).json(usuarioActualizado);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({error: error.message});
    }
});

//PATCH A ITEMS
app.patch('/usuarios/items/usuario', async (req, res) => { //funciona
    const userId = req.session.usuario;
    const {itemComprado, cantidadComprada} = req.body;

    try {
        const usuarioActualizado = await db.comprarItems(userId, itemComprado, cantidadComprada);
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Hubo un error al comprar el item'});
    }
});

//PATCH A MONEDAS
app.patch('/usuarios/monedas/usuario', async (req, res) => { //funciona
    console.log(req.session)
    const userId = req.session.usuario;
    const {monedasObtenidas} = req.body;

    try {
        const usuarioActualizado = await db.sumarMonedas(userId, monedasObtenidas);
        res.status(HTTP_OK).json(usuarioActualizado);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({error: error.message});
    }
});

//CAMBIAR AJUSTES
app.patch('/usuarios/ajustes/usuario', async (req, res) => { //funciona
    const userId = req.params.id;
    const {valorMusica, valorSonido, valorPantallaCompleta} = req.body;

    try {
        const usuarioActualizado = await db.cambiarAjustes(userId, valorMusica, valorSonido, valorPantallaCompleta);
        res.status(HTTP_OK).json(usuarioActualizado);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({error: error.message});
    }
});

app.post("/usuarios/register", async (req, res) => {
    try {
        const nombre = req.body.nombre;
        const password = req.body.password;
        const nacionalidad = req.body.nacionalidad;
        if (!nombre || !password || !nacionalidad) {
            return res.status(400).send({status: "Error", message: "Los campos están incompletos"})
        }

        const usuarioAResvisar = await db.existeUsuario(nombre);
        if (!usuarioAResvisar) {
            const salt = await bcrypt.genSalt(5);
            const hashPassword = await bcrypt.hash(password, salt);
            const nuevoUsuario = {
                nombre, password: hashPassword, nacionalidad
            }
            await db.altaUsuario(nuevoUsuario);
            return res.status(201).send({status: "ok", message: `Usuario ${nuevoUsuario.nombre} registrado`})
        } else {
            return res.status(400).send({status: "Error", message: "Este usuario ya existe"});
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({status: "error", message: `Error al crear el usuario.`})
    }
});

app.post("/usuarios/login", async (req, res) => {
    console.log(req.body);

    const nombre = req.body.nombre;
    const password = req.body.password;

    // Validación de campos incompletos
    if (!nombre || !password) {
        return res.status(400).send({status: "Error", message: "Los campos están incompletos"});
    }

    // Buscar usuario en base de datos
    const usuarioAResvisar = await db.existeUsuario(nombre);
    if (!usuarioAResvisar) {
        return res.status(400).send({status: "Error", message: "Error durante login"});
    }

    // Validar contraseña
    const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
    if (!loginCorrecto) {
        return res.status(400).send({status: "Error", message: "Error durante login"});
    }

    // Inicio de sesión exitoso - almacenar datos en la sesión
    req.session.usuario = usuarioAResvisar._id.toString();  // Guardar información del usuario en la sesión
    console.log(req.session)

    // No se genera token JWT (opcional para este enfoque)
    res
        .location(`/usuarios/${usuarioAResvisar._id}`)
        .status(HTTP_OK)
        .send({usuario: usuarioAResvisar, mensaje: "Usuario logueado"});
});

/*app.post("/usuarios/login", async (req, res) => {
    console.log(req.body)
    const nombre = req.body.nombre;
    const password = req.body.password;
    if (!nombre || !password) {
        return res.status(400).send({status: "Error", message: "Los campos están incompletos"})
    }
    const usuarioAResvisar = await db.existeUsuario(nombre);
    if (!usuarioAResvisar) {
        return res.status(400).send({status: "Error", message: "Error durante login"})
    }
    const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
    console.log(loginCorrecto)
    if (!loginCorrecto) {
        return res.status(400).send({status: "Error", message: "Error durante login"})
    } else {
        const token = jsonwebtoken.sign(
            {user: usuarioAResvisar.nombre},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRATION});

        const cookieOption = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            path: "/"
        }
        res.cookie("jwt", token, cookieOption);
        res
            .location(`/usuarios/${usuarioAResvisar._id}`)
            .status(HTTP_OK)
            .send({usuario: usuarioAResvisar, mensaje: "Usuario logueado"});
    }
});*/
