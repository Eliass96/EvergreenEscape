require("dotenv").config();
const express = require("express");
const db = require("./db.js");


const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const PORT = process.env.PORT || 40000;

const app = express();
app.use(express.json());
app.use(express.static("www/public"));
db.conectar().then(() => {
    console.log("Conectado con la base de datos.");
    app.listen(PORT, () =>
        console.log("Servicio escuchando en el puerto " + PORT)
    );
});

//METODOS
// GET A PUNTUACION-- LISTA PUNTUACION USUARIO
app.get("/usuarios/:id", async function (req, resp) { // funciona
    try {
        const idUsuario = req.params.id;
        console.log(idUsuario);
        usuarioEncontrado = await db.listarPuntuaciones(idUsuario);
        resp.status(HTTP_OK).send(usuarioEncontrado);
    } catch (err) {
        resp.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
});
//CREAR USUARIO
app.post("/usuarios", async function (req, resp) { // funciona
    try {
        const { nombre, password, nacionalidad, puntuaciones, monedas, superSalto, puntuacionExtra, revivir, inmunidad, musica, sonido, pantallaCompleta } = req.body;

        const nuevoUsuario = await db.altaUsuario({ nombre, password, nacionalidad, puntuaciones, monedas, superSalto, puntuacionExtra, revivir,
            inmunidad, musica, sonido, pantallaCompleta });

        return resp.status(HTTP_CREATED).json({ mensaje: 'Usuario creado con éxito.', usuario: nuevoUsuario });
    } catch (err) {
        return resp.status(HTTP_INTERNAL_SERVER_ERROR).json({ mensaje: 'Error al crear el usuario. Por favor, inténtelo de nuevo más tarde.' });
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
