const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const dotenv = require("dotenv");
const express = require("express");
const path = require('path');
const {fileURLToPath} = require('url');
const {createRequire} = require('module');
const db = require("./db.js");
dotenv.config();
//import {methods as authentication, usuarios} from "../www/public/js/authentication.controller"
//const requireFunc = createRequire('create-require');
//const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const PORT = process.env.PORT || 40000;

const app = express();
//app.use(express.static("/server"));
app.use(express.json());
app.use(cookieParser())
app.use(express.static("www/public"));
db.conectar().then(() => {
    console.log("Conectado con la base de datos.");
    app.listen(PORT, () =>
        console.log("Servicio escuchando en el puerto " + PORT)
    );
});

// INICIO DE SESIÓN Y REGISTRO


//METODOS
// GET A PUNTUACION-- LISTA PUNTUACION USUARIO
app.get("/usuarios/:id", async function (req, resp) { // funciona
    try {
        const idUsuario = req.params.id;
        console.log(idUsuario);
        let usuarioEncontrado = await db.listarPuntuaciones(idUsuario);
        resp.status(HTTP_OK).send(usuarioEncontrado);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});

app.get("/puntuaciones/pais/:id", async function (req, resp) {
    try {
        const pais = req.params.id;
        let puntuacionesPorPais = await db.listarPuntuacionesPorPais(pais);
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

//CREAR USUARIO
app.post("/usuarios", async function (req, resp) { // funciona
    try {
        const {
            nombre,
            password,
            nacionalidad,
            puntuaciones,
            monedas,
            superSalto,
            puntuacionExtra,
            revivir,
            inmunidad,
            musica,
            sonido,
            pantallaCompleta
        } = req.body;

        const nuevoUsuario = await db.altaUsuario({
            nombre, password, nacionalidad, puntuaciones, monedas, superSalto, puntuacionExtra, revivir,
            inmunidad, musica, sonido, pantallaCompleta
        });

        return resp.status(HTTP_CREATED).json({mensaje: 'Usuario creado con éxito.', usuario: nuevoUsuario});
    } catch (err) {
        return resp.status(HTTP_INTERNAL_SERVER_ERROR).json({mensaje: 'Error al crear el usuario. Por favor, inténtelo de nuevo más tarde.'});
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
app.patch('/usuarios/items/:id', async (req, res) => { //funciona
    const userId = req.params.id;
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
app.patch('/usuarios/monedas/:id', async (req, res) => { //funciona
    const userId = req.params.id;
    const {monedasObtenidas} = req.body;

    try {
        const usuarioActualizado = await db.sumarMonedas(userId, monedasObtenidas);
        res.status(HTTP_OK).json(usuarioActualizado);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({error: error.message});
    }
});

//CAMBIAR AJUSTES
app.patch('/usuarios/ajustes/:id', async (req, res) => { //funciona
    const userId = req.params.id;
    const {valorMusica, valorSonido, valorPantallaCompleta} = req.body;

    try {
        const usuarioActualizado = await db.cambiarAjustes(userId, valorMusica, valorSonido, valorPantallaCompleta);
        res.status(HTTP_OK).json(usuarioActualizado);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({error: error.message});
    }
});

// GET A PUNTUACION-- LISTA PUNTUACION PAIS

// GET A PUNTUACION-- LISTA PUNTUACION GLOBAL


//app.post("/usuarios/login", authentication.login);
app.post("/usuarios", async (req, res) => {
    try {
        const user = req.body.nombre;
        const password = req.body.password;
        const nacionalidad = req.body.nacionalidad;
        if (!user || !password || !nacionalidad) {
            return res.status(400).send({status: "Error", message: "Los campos están incompletos"})
        }
        const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
        if (usuarioAResvisar) {
            return res.status(400).send({status: "Error", message: "Este usuario ya existe"})
        }
        const salt = await bcrypt.genSalt(5);
        const hashPassword = await bcrypt.hash(password, salt);
        const nuevoUsuario = {
            user, nacionalidad, password: hashPassword
        }
        await db.altaUsuario(nuevoUsuario);
        return res.status(201).send({status: "ok", message: `Usuario ${nuevoUsuario.user} registrado`, redirect: "/"})
    } catch (err) {
        return res.status(500).send({status: "error", message: `Error al crear el usuario.`, redirect: "/"})
    }
});