const mongoose = require("mongoose");

//CREACION DEL ESQUEMA
// USUARIO-≥ nombre required unique, contraseña required, nacionalidad required, array de puntuaciones vacio,
// monedas auto 0, itemrevivir 0, itemsalto 0, iteminmunidad 0,
// itempuntuacion 0, musicabool true, sonidobool true, screenBool true.

const UsuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        nacionalidad: {
            type: String,
            required: true
        },
        puntuaciones: {
            type: [Number],
            default: []
        },
        monedas: {
            type: Number,
            default: 0
        },
        superSalto: {
            type: Number,
            default: 0
        },
        puntuacionExtra: {
            type: Number,
            default: 0
        },
        revivir: {
            type: Number,
            default: 0
        },
        inmunidad: {
            type: Number,
            default: 0
        },
        musica: {
            type: Boolean,
            default: true
        },
        sonido: {
            type: Boolean,
            default: true
        },
        pantallaCompleta: {
            type: Boolean,
            default: true
        },
    }
);

const Usuario = mongoose.model('Usuario', UsuarioSchema);

exports.conectar = async function () {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log("Conexión a la base de datos establecida con éxito.");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
};

exports.desconectar = mongoose.disconnect;

//METODOS

//AÑADIR PUNTUACIÓN AL USUARIO
exports.agregarPuntuacion = async function (userId, nuevaPuntuacion) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        usuario.puntuaciones.push(nuevaPuntuacion);
        await usuario.save();
        return usuario;
    } catch (error) {
        throw new Error('Error al agregar puntuación: ' + error.message);
    }
};
//LISTAR PUNTUACIONES DEL USUARIO
exports.listarPuntuaciones = async function (userId) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        usuario.puntuaciones.sort((a, b) => b - a);

        // Obtiene las primeras 10 puntuaciones
        return usuario.puntuaciones.slice(0, 10);
    } catch (error) {
        throw new Error('Error al listar puntuaciones: ' + error.message);
    }
};

//CAMBIAR AJUSTES
exports.cambiarAjustes = async function (userId, valorMusica, valorSonido, valorPantallaCompleta) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        usuario.musica = valorMusica;
        usuario.sonido = valorSonido;
        usuario.pantallaCompleta = valorPantallaCompleta;

        await usuario.save();
        return usuario;
    } catch (error) {
        console.error(error);
        throw new Error('Hubo un error al cambiar los ajustes');
    }
}

//EDITAR ITEMS AL COMPRAR
exports.comprarItems = async function (userId, itemComprado, cantidadComprada) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        let costoItem = 0;
        switch (itemComprado) {
            case 1: // Supersalto
                costoItem = cantidadComprada * 20;
                usuario.superSalto++;
                break;
            case 2: // X2
                costoItem = cantidadComprada * 30;
                usuario.puntuacionExtra++;
                break;
            case 3: // Inmunidad
                costoItem = cantidadComprada * 40;
                usuario.inmunidad++;
                break;
            case 4: // Revivir
                costoItem = cantidadComprada * 50;
                usuario.revivir++;
                break;
            default:
                throw new Error('Item no válido');
        }
        if (usuario.monedas < costoItem) {
            throw new Error('El usuario no tiene suficientes monedas para comprar este item');
        }
        usuario.monedas -= costoItem;
        await usuario.save();
        return usuario;
    } catch (error) {
        console.error(error);
        throw new Error('Hubo un error al comprar el item');
    }
}

//EDITAR MONEDAS
exports.sumarMonedas = async function (userId, monedasObtenidas) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        usuario.monedas += monedasObtenidas;
        await usuario.save();
        return usuario;
    } catch (error) {
        console.error(error);
        throw new Error('Hubo un error al sumar monedas');
    }
}

//CREAR USUARIO
exports.altaUsuario = async function (datosDeUsuario) {
    return Usuario.create(datosDeUsuario);
}


//LISTAR PUNTUACIONES POR PAIS ----------
exports.listarPuntuacionesPorPais = async function (nacionalidad) {
    try {
        // Realizar una consulta a la base de datos para encontrar usuarios por país
        const usuarios = await Usuario.find({nacionalidad: nacionalidad});

        if (usuarios.length === 0) {
            throw new Error('No se encontraron usuarios para el país especificado');
        }

        let puntuaciones = [];

        usuarios.forEach(usuario => {
            puntuaciones = puntuaciones.concat(usuario.puntuaciones);
        });

        puntuaciones.sort((a, b) => b - a);
        return puntuaciones.slice(0, 10);
    } catch (error) {
        throw new Error('Error al listar puntuaciones por país: ' + error.message);
    }
};

//LISTAR PUNTUACIONES GLOBALES ----------
exports.listarTodasLasPuntuaciones = async function () {
    try {
        const usuarios = await Usuario.find();

        if (usuarios.length === 0) {
            throw new Error('No se encontraron usuarios');
        }

        let puntuaciones = [];

        usuarios.forEach(usuario => {
            puntuaciones = puntuaciones.concat(usuario.puntuaciones);
        });

        puntuaciones.sort((a, b) => b - a);

        return puntuaciones.slice(0, 10);
    } catch (error) {
        throw new Error('Error al listar todas las puntuaciones: ' + error.message);
    }
};


//AÑADIR USUARIO

//VERIFICAR USUARIO AL INICIAR SESION
