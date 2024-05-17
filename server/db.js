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

const ObjetoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Objeto = mongoose.model('Objeto', ObjetoSchema);

//METODOS DE USUARIO
//AÑADIR PUNTUACIÓN AL USUARIO
exports.agregarPuntuacion = async function (userId, nuevaPuntuacion) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        if (usuario.puntuaciones.length >= 10) {
            usuario.puntuaciones.sort((a, b) => b - a);
            const algunaPuntuacionMenor = usuario.puntuaciones.some(puntuacion => nuevaPuntuacion > puntuacion);

            if (algunaPuntuacionMenor) {
                usuario.puntuaciones.splice(usuario.puntuaciones.length - 1, 1);
                usuario.puntuaciones.push(nuevaPuntuacion);
                await usuario.save();
            }
        } else {
            usuario.puntuaciones.push(nuevaPuntuacion);
            await usuario.save();
        }
        return usuario;
    } catch
        (error) {
        throw new Error('Error al agregar puntuación: ' + error.message);
    }
}
;
//LISTAR PUNTUACIONES DEL USUARIO
exports.listarPuntuaciones = async function (userId) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        usuario.puntuaciones.sort((a, b) => b - a);
        return usuario.puntuaciones.slice(0, 10);
    } catch (error) {
        throw new Error('Error al listar las puntuaciones: ' + error.message);
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
        throw new Error('Error al buscar el usuario por nombre: ' + error.message);
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
exports.comprarItems = async function (userId, objetoId, cantidadComprada) {
    try {
        const usuario = await Usuario.findById(userId);
        const objeto = await Objeto.findById(objetoId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        let costoItem = cantidadComprada * objeto.precio;
        if (usuario.monedas < costoItem) {
            throw new Error('El usuario no tiene suficientes monedas para comprar este item');
        }
        usuario.monedas -= costoItem;
        switch (objeto.nombre) {
            case 'Súper salto':
                usuario.superSalto += cantidadComprada;
                break;
            case 'Puntuación x2':
                usuario.puntuacionExtra += cantidadComprada;
                break;
            case 'Inmunidad':
                usuario.inmunidad += cantidadComprada;
                break;
            case 'Revivir':
                usuario.revivir += cantidadComprada;
                break;
            default:
                throw new Error('Item no válido');
        }
        await usuario.save();
        return usuario;
    } catch (error) {
        throw new Error('Hubo un error al comprar el objeto');
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
            throw new Error('No puedes tener objetos negativos');
        }

        // Actualizar elementos
        usuario.superSalto = superSaltoDespuesDePartida;
        usuario.puntuacionExtra = puntuacionExtraDespuesDePartida;
        usuario.inmunidad = inmunidadDespuesDePartida;
        usuario.revivir = revivirDespuesDePartida;

        await usuario.save();
        return usuario;
    } catch (error) {
        throw new Error('Hubo un error al actualizar los objetos: ' + error.message);
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
    try {
        return Usuario.create(datosDeUsuario);
    } catch (error) {
        throw new Error('Error al agregar el usuario: ' + error.message);
    }
}

//LISTAR PUNTUACIONES POR PAIS
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
        throw new Error('Error al listar las mejores puntuaciones por país: ' + error.message);
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
        throw new Error('Error al listar todas las puntuaciones: ' + error.message);
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
        throw new Error('Error al listar todos los usuarios: ' + error.message);
    }
};

exports.existeUsuario = async function (nombreUsuario) {
    try {
        return await Usuario.findOne({nombre: nombreUsuario});
    } catch (error) {
        throw new Error('Error al comprobar la existencia del usuario: ' + error.message);
    }
};

//METODOS DE OBJETO
// AGREGAR OBJETO
exports.agregarObjetos = async function () {
    try {
        let objetoSuperSalto = await Objeto.findOne({nombre: "Súper salto"});
        if (!objetoSuperSalto) {
            await Objeto.create({nombre: "Súper salto", precio: 20});
        }

        let objetoPuntuacionX2 = await Objeto.findOne({nombre: "Puntuación x2"});
        if (!objetoPuntuacionX2) {
            await Objeto.create({nombre: "Puntuación x2", precio: 30});
        }

        let objetoInmunidad = await Objeto.findOne({nombre: "Inmunidad"});
        if (!objetoInmunidad) {
            await Objeto.create({nombre: "Inmunidad", precio: 40});
        }

        let objetoRevivir = await Objeto.findOne({nombre: "Revivir"});
        if (!objetoRevivir) {
            await Objeto.create({nombre: "Revivir", precio: 50});
        }
    } catch (error) {
        throw new Error('Error al agregar los objetos a la tienda: ' + error.message);
    }
}

exports.getObjeto = async function (nombreObjeto) {
    try {
        return await Objeto.findOne({nombre: nombreObjeto});
    } catch (error) {
        throw new Error('Error al cargar el objeto: ' + error.message);
    }
};

exports.listarObjetos = async function () {
    try {
        let objetos = await Objeto.find();
    } catch (error) {
        throw new Error('Error al listar todos los objetos: ' + error.message);
    }
};

exports.conectar = async function () {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
};

exports.desconectar = mongoose.disconnect;


