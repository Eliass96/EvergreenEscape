const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const session = require('express-session');
const cors = require('cors');

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;
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
app.use(cors());
app.use(express.static("www"));
db.conectar().then(() => {
    console.log("Conectado con la base de datos.");
    app.listen(PORT, () =>
        console.log("Servicio escuchando en el puerto " + PORT)
    );
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

                req.session.destroy(); // Destruir sesión
                res.status(HTTP_UNAUTHORIZED).send({message: 'No estás logueado'});
            }
        } else {

            res.status(HTTP_UNAUTHORIZED).send({message: 'No estás logueado'});
        }
    } catch (error) {
        res.status(HTTP_UNAUTHORIZED).send({message: 'No estás logueado'});
    }
});

// CERRAR SESIÓN
app.post('/usuarios/cerrarSesion', async (req, res) => {
    try {
        if (req.session) {
            req.session.destroy();
            res.status(HTTP_OK).send({message: 'Sesión cerrada'});
        } else {
            res.status(HTTP_UNAUTHORIZED).send({message: 'No estás logueado'});
        }
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({message: 'Error inesperado al cerrar sesión'});
    }
});

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
        let usuarioEncontrado = await db.getUsuario(userId);
        resp.status(HTTP_OK).send(usuarioEncontrado);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

// ¿?
app.get("/usuarios/usuario/:user/:password", async function (req, resp) { // funciona
    try {
        const userName = req.params.user;
        const userPassword = req.params.password;
        let usuarioEncontrado = await db.getUsuarioByName(userName);
        let usuarioParseado = JSON.stringify(usuarioEncontrado);
        if (usuarioEncontrado != null) {
            let esCorrecto = await bcryptjs.compare(userPassword, usuarioEncontrado.password);
            if (!esCorrecto) return resp.status(HTTP_OK).send({message: "PASSWORD", data: usuarioParseado});
            return resp.status(HTTP_OK).send({message: "CORRECTO", data: usuarioParseado});
        }
        return resp.status(HTTP_OK).send({message: "USER", data: usuarioParseado});
    } catch (err) {
        console.log(err)
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

// LISTAR LAS MEJORES PUNTUACIONES DEL USUARIO
app.get("/usuarios/usuario/puntuaciones", async function (req, resp) { // funciona
    try {
        const idUsuario = req.session.usuario;
        console.log(idUsuario)
        let usuarioEncontrado = await db.listarPuntuaciones(idUsuario);
        resp.status(HTTP_OK).send(usuarioEncontrado);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

// LISTAR LAS PUNTUACIONES POR PAIS
app.get("/usuarios/puntuaciones/:nacionalidad", async function (req, resp) {
    try {
        const pais = req.params.nacionalidad;
        const paisDec = decodeURIComponent(pais);
        let puntuacionesPorPais = await db.listarPuntuacionesPorPais(paisDec);
        resp.status(HTTP_OK).send(puntuacionesPorPais);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

// LISTAR TODAS LAS PUNTUACIONES
app.get("/usuarios/puntuaciones", async function (req, resp) {
    try {
        const todasLasPuntuaciones = await db.listarTodasLasPuntuaciones();
        resp.status(HTTP_OK).send(todasLasPuntuaciones);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

// PATCH PUNTUACION
app.patch('/usuarios/usuario/nuevaPuntuacion', async (req, res) => { //funciona
    const userId = req.session.usuario;
    const {nuevaPuntuacion} = req.body;

    try {
        const usuarioActualizado = await db.agregarPuntuacion(userId, nuevaPuntuacion);
        res.status(HTTP_OK).json(usuarioActualizado);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({error: error.message});
    }
});

//PATCH A ITEMS
app.patch('/usuarios/usuario/items', async (req, res) => { //funciona
    const userId = req.session.usuario;
    const {itemComprado, cantidadComprada} = req.body;

    try {
        const usuarioActualizado = await db.comprarItems(userId, itemComprado, cantidadComprada);
        res.status(HTTP_OK).json(usuarioActualizado);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({error: 'Hubo un error al comprar el item'});
    }
});

// GUARDAR OBJETOS DESPUÉS DE LA PARTIDA
app.patch('/usuarios/usuario/itemsDespuesDePartida', async (req, res) => { //funciona
    const userId = req.session.usuario;
    const {
        cantidadSuperSalto,
        cantidadPuntuacionx2,
        cantidadAntiObstaculos,
        cantidadRevivir
    } = req.body;

    try {
        const usuarioActualizado = await db.utilizarItems(
            userId,
            cantidadSuperSalto,
            cantidadPuntuacionx2,
            cantidadAntiObstaculos,
            cantidadRevivir);
        res.status(HTTP_OK).json(usuarioActualizado);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({error: 'Hubo un error al actualizar los items'});
    }
});

//PATCH A MONEDAS
app.patch('/usuarios/usuario/monedas', async (req, res) => { //funciona
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
app.patch('/usuarios/usuario/ajustes', async (req, res) => { //funciona
    const userId = req.session.usuario;
    const {valorMusica, valorSonido, valorPantallaCompleta} = req.body;

    try {
        const usuarioActualizado = await db.cambiarAjustes(userId, valorMusica, valorSonido, valorPantallaCompleta);
        res.status(HTTP_OK).json(usuarioActualizado);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({error: error.message});
    }
});

// GUARDAR FONDO DE PARTIDA
app.patch('/usuarios/usuario/fondoPartida', async (req, res) => { //funciona
    const userId = req.session.usuario;
    const {fondoJuego} = req.body;

    try {
        const usuarioActualizado = await db.guardarFondo(userId, fondoJuego);
        res.status(HTTP_OK).json(usuarioActualizado);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({error: error.message});
    }
});

// REGISTRO
app.post("/usuarios/registro", async (req, res) => {
    try {
        debugger;
        const nombre = req.body.nombre;
        const password = req.body.password;
        const nacionalidad = req.body.nacionalidad;
        if (!nombre || !password || !nacionalidad) {
            return res.status(HTTP_BAD_REQUEST).send({status: "Error", message: "Los campos están incompletos"})
        }

        const usuarioAResvisar = await db.existeUsuario(nombre);
        console.log(usuarioAResvisar);
        if (!usuarioAResvisar) {
            const salt = await bcrypt.genSalt(5);
            const hashPassword = await bcrypt.hash(password, salt);
            const nuevoUsuario = {
                nombre, password: hashPassword, nacionalidad
            }
            await db.altaUsuario(nuevoUsuario);
            return res.status(HTTP_CREATED).send({status: "ok", message: `Usuario ${nuevoUsuario.nombre} registrado`})
        } else {
            return res.status(HTTP_CONFLICT).send({status: "Error", message: "Este usuario ya existe"});
        }
    } catch (err) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).send({status: "Error", message: `Error al crear el usuario.`})
    }
});

// INICIO DE SESIÓN
app.post("/usuarios/login", async (req, res) => {
    try {
        const nombre = req.body.nombre;
        const password = req.body.password;

        if (!nombre || !password) {
            return res.status(HTTP_BAD_REQUEST).send({status: "Error", message: "Los campos están incompletos"});
        }

        const usuarioAResvisar = await db.existeUsuario(nombre);
        if (!usuarioAResvisar) {
            return res.status(HTTP_UNAUTHORIZED).send({status: "Error", message: "El usuario no existe"});
        }

        const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
        if (!loginCorrecto) {
            return res.status(HTTP_FORBIDDEN).send({status: "Error", message: "Contraseña incorrecta"});
        }

        req.session.usuario = usuarioAResvisar._id.toString();

        return res
            .location(`/usuarios/${usuarioAResvisar._id}`)
            .status(HTTP_OK)
            .send({usuario: usuarioAResvisar, mensaje: "Usuario logueado"});

    } catch (err) {
        return res.status(HTTP_INTERNAL_SERVER_ERROR).send({status: "error", message: `Error al iniciar sesión.`})
    }
});

