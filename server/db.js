require("dotenv").config();
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
        fondoClaro: {
            type: Boolean,
            default: true
        },
    }
);

const Usuario = mongoose.model('Usuario', UsuarioSchema);

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
        console.log(usuario.puntuaciones.slice(0, 10));
        // Obtiene las primeras 10 puntuaciones
        return usuario.puntuaciones.slice(0, 10);
    } catch (error) {
        throw new Error('Error al listar puntuaciones: ' + error.message);
    }
};

// GET USUARIO
exports.getUsuario = async function (userId) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        // Obtiene las primeras 10 puntuaciones
        return usuario;
    } catch (error) {
        throw new Error('Error al buscar el usuario: ' + error.message);
    }
};

exports.getUsuarioByName = async function (userName) {
    try {
        return await Usuario.findOne({nombre: userName});
    } catch (error) {
        throw new Error('Error al buscar el usuario: ' + error.message);
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
        throw new Error('Hubo un error al cambiar los ajustes');
    }
}

exports.guardarFondo = async function (userId, fondoJuego) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        usuario.fondoClaro = fondoJuego;

        await usuario.save();
        return usuario;
    } catch (error) {
        throw new Error('Hubo un error al guardar el fondo');
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
                usuario.superSalto += cantidadComprada;
                break;
            case 2: // X2
                costoItem = cantidadComprada * 30;
                usuario.puntuacionExtra += cantidadComprada;
                break;
            case 3: // Inmunidad
                costoItem = cantidadComprada * 40;
                usuario.inmunidad += cantidadComprada;
                break;
            case 4: // Revivir
                costoItem = cantidadComprada * 50;
                usuario.revivir += cantidadComprada;
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
        throw new Error('Hubo un error al comprar el item');
    }
}

// ACTUALIZAR ITEMS DESPUÉS DE UNA PARTIDA
// ACTUALIZAR ITEMS AL UTILIZARLOS
exports.utilizarItems = async function (userId, superSaltoDespuesDePartida, puntuacionExtraDespuesDePartida, inmunidadDespuesDePartida, revivirDespuesDePartida) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar si el usuario tiene suficientes elementos antes de actualizar
        if (superSaltoDespuesDePartida < 0 ||
            puntuacionExtraDespuesDePartida < 0 ||
            inmunidadDespuesDePartida < 0 ||
            revivirDespuesDePartida < 0) {
            throw new Error('No puedes tener items negativos');
        }

        // Actualizar elementos
        usuario.superSalto = superSaltoDespuesDePartida;
        usuario.puntuacionExtra = puntuacionExtraDespuesDePartida;
        usuario.inmunidad = inmunidadDespuesDePartida;
        usuario.revivir = revivirDespuesDePartida;

        await usuario.save();
        return usuario;
    } catch (error) {
        throw new Error('Hubo un error al actualizar los items: ' + error.message);
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
        const usuarios = await Usuario.find({nacionalidad: nacionalidad});

        if (usuarios.length === 0) {
            throw new Error('No se encontraron usuarios para el país especificado');
        }

        let todasLasPuntuaciones = [];

        usuarios.forEach(usuario => {
            todasLasPuntuaciones.push(...usuario.puntuaciones);
        });

        todasLasPuntuaciones.sort((a, b) => b - a);

        const mejoresPuntuaciones = todasLasPuntuaciones.slice(0, 10);

        const mejoresPuntuacionesConUsuarios = [];

        mejoresPuntuaciones.forEach(puntuacion => {
            usuarios.forEach(usuario => {
                if (usuario.puntuaciones.includes(puntuacion)) {
                    mejoresPuntuacionesConUsuarios.push({
                        nombre: usuario.nombre,
                        puntuacion: puntuacion
                    });
                }
            });
        });

        return mejoresPuntuacionesConUsuarios;
    } catch (error) {
        throw new Error('Error al listar usuarios con mejores puntuaciones por país: ' + error.message);
    }
};

//LISTAR PUNTUACIONES GLOBALES ----------
exports.listarTodasLasPuntuaciones = async function () {
    try {
        const usuarios = await Usuario.find();

        if (usuarios.length === 0) {
            throw new Error('No se encontraron usuarios');
        }

        let todasLasPuntuaciones = [];

        usuarios.forEach(usuario => {
            todasLasPuntuaciones.push(...usuario.puntuaciones);
        });

        todasLasPuntuaciones.sort((a, b) => b - a);

        const mejoresPuntuaciones = todasLasPuntuaciones.slice(0, 10);

        const mejoresPuntuacionesConUsuarios = [];

        mejoresPuntuaciones.forEach(puntuacion => {
            usuarios.forEach(usuario => {
                if (usuario.puntuaciones.includes(puntuacion)) {
                    mejoresPuntuacionesConUsuarios.push({
                        nombre: usuario.nombre,
                        puntuacion: puntuacion
                    });
                }
            });
        });

        return mejoresPuntuacionesConUsuarios;
    } catch (error) {
        throw new Error('Error al listar todas las puntuaciones con nombres: ' + error.message);
    }
};


//LISTAR USUARIOS ----------
exports.listarTodosLosUsuarios = async function () {
    try {
        const usuarios = await Usuario.find();

        if (usuarios.length === 0) {
            throw new Error('No se encontraron usuarios');
        }
        return usuarios;
    } catch (error) {
        throw new Error('Error al listar todas las puntuaciones: ' + error.message);
    }
};

exports.existeUsuario = async function (nombreUsuario) {
    try {
        return await Usuario.findOne({nombre: nombreUsuario});
    } catch (error) {
        throw new Error('Error al listar todas las puntuaciones: ' + error.message);
    }
};

exports.conectar = async function () {
    try {
        const uri = process.env.MONGODB_URI;
        console.log(process.env);
        await mongoose.connect(uri);
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
};

exports.desconectar = mongoose.disconnect;


