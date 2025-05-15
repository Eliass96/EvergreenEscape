require("dotenv").config();
const mongoose = require("mongoose");
const cron = require('node-cron');

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
        email: {
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
        amigos: {
            type: [String],
            default: []
        },
        solicitudesAmistad: {
            type: [String],
            default: []
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
        fondoClaro: {
            type: Boolean,
            default: true
        },
        avatar: {
            type: String, // solo guardamos el nombre del archivo
            default: "default.jpg" // o lo que uses como imagen por defecto
        },
        experiencia: {
            type: Number,
            default: 0
        },
        recompensa: {
            type: [String],
            default: []
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

const MensajeSchema = new mongoose.Schema({
    from: String,
    to: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
});




const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Objeto = mongoose.model('Objeto', ObjetoSchema);
const Mensaje = mongoose.model('Mensaje', MensajeSchema);

//METODOS DE USUARIO

//AÑADIR AMIGO
exports.agregarAmigo = async (userId, amigoNombre) => {
    try {
        const usuario = await Usuario.findById(userId);
        const amigo = await Usuario.findOne({nombre: amigoNombre});
        if (!usuario) throw new Error("Usuario no encontrado");
        if (!amigo) throw new Error("Amigo no encontrado");

        if (!usuario.amigos.includes(amigo.nombre)) {
            usuario.amigos.push(amigo.nombre);
            amigo.amigos.push(usuario.nombre);
            usuario.solicitudesAmistad = usuario.solicitudesAmistad.filter(nombre => nombre !== amigo.nombre);
            amigo.solicitudesAmistad = amigo.solicitudesAmistad.filter(nombre => nombre !== usuario.nombre);
            await usuario.save();
            await amigo.save();
            return {success: true, message: "Amigo agregado exitosamente"};
        } else {
            return {success: false, message: "El usuario ya es tu amigo"};
        }
    } catch (error) {
        return {success: false, message: error.message};
    }
};

//ELIMINAR AMIGO
exports.eliminarAmigo = async (userId, amigoNombre) => {
    try {
        const usuario = await Usuario.findById(userId);
        const amigo = await Usuario.findOne({nombre: amigoNombre});
        if (!usuario) throw new Error("Usuario no encontrado");
        if (!amigo) throw new Error("Amigo no encontrado");

        usuario.amigos = usuario.amigos.filter((id) => id !== amigo.nombre);
        amigo.amigos = amigo.amigos.filter((id) => id !== usuario.nombre);
        await usuario.save();
        await amigo.save();
        return {success: true, message: "Amigo eliminado exitosamente"};
    } catch (error) {
        return {success: false, message: error.message};
    }
};

//ENVIAR SOLICITUD DE AMISTAD
exports.agregarSolicitud = async (amigoNombre, usuarioId) => {
    try {
        const amigoSolicitado = await Usuario.findOne({nombre: amigoNombre});
        const usuario = await Usuario.findById(usuarioId);

        if (!amigoSolicitado) throw new Error("Amigo no encontrado");
        if (!usuario) throw new Error("Usuario no encontrado");

        if (amigoSolicitado.solicitudesAmistad.includes(usuario.nombre)) {
            throw new Error("La solicitud ya ha sido enviada");
        }

        amigoSolicitado.solicitudesAmistad.push(usuario.nombre);
        await amigoSolicitado.save();
        return {success: true, message: "Solicitud de amistad enviada exitosamente"};
    } catch (error) {
        return {success: false, message: error.message};
    }
};

//RECHAZAR SOLICITUD DE AMISTAD
exports.rechazarSolicitud = async (amigoNombre, usuarioId) => {
    try {
        const amigoSolicitado = await Usuario.findOne({nombre: amigoNombre});
        const usuario = await Usuario.findById(usuarioId);

        if (!amigoSolicitado) throw new Error("Usuario no encontrado");
        if (!usuario) throw new Error("Amigo no encontrado");

        if (!usuario.solicitudesAmistad.includes(amigoSolicitado.nombre)) {
            throw new Error("La solicitud no ha sido enviada");
        }

        usuario.solicitudesAmistad = usuario.solicitudesAmistad.filter(nombre => nombre !== amigoSolicitado.nombre);
        await usuario.save();
        return {success: true, message: "Solicitud de amistad rechazada exitosamente"};
    } catch (error) {
        return {success: false, message: error.message};
    }
};

//CREAR USUARIO
exports.altaUsuario = async function (datosDeUsuario) {
    try {
        return Usuario.create(datosDeUsuario);
    } catch (error) {
        throw new Error('Error al agregar el usuario: ' + error.message);
    }
}

// GET USUARIO
exports.getUsuario = async function (userId) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
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

// EXISTE USUARIO
exports.existeUsuario = async function (email, nombre) {
    try {
        return await Usuario.findOne({
            $or: [{email: email}, {nombre: nombre}]
        });
    } catch (error) {
        throw new Error('Error al comprobar la existencia del usuario: ' + error.message);
    }
};

//LISTAR USUARIOS
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
        return usuario.puntuaciones.slice(0, 10);
    } catch (error) {
        throw new Error('Error al listar las puntuaciones: ' + error.message);
    }
};

//MÉTODOS DE AJUSTES
//CAMBIAR AJUSTES
exports.cambiarAjustes = async function (userId, valorMusica, valorSonido) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        usuario.musica = valorMusica;
        usuario.sonido = valorSonido;

        await usuario.save();
        return usuario;
    } catch (error) {
        throw new Error('Hubo un error al cambiar los ajustes');
    }
}

//GUARDAR FONDO
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
            case 'Super salto':
                usuario.superSalto += cantidadComprada;
                break;
            case 'Puntuacion x2':
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

//LISTAR PUNTUACIONES DE AMIGOS
exports.listarPuntuacionesDeAmigos = async function (userId) {
    try {
        // Buscar al usuario por su ID
        const usuario = await Usuario.findOne({_id: userId});
        if (!usuario) {
            throw new Error('No se encontró al usuario');
        }

        let mejoresPuntuacionesAmigos = [];

        for (const userName of usuario.amigos) {
            let amigo = await Usuario.findOne({nombre: userName});
            if (amigo) {
                if (amigo.puntuaciones) {
                    amigo.puntuaciones.forEach(puntuacion => {
                        mejoresPuntuacionesAmigos.push({
                            nombre: amigo.nombre,
                            puntuacion: puntuacion
                        });
                    });
                }
            }
        }

        if (usuario.puntuaciones) {
            usuario.puntuaciones.forEach(puntuacion => {
                mejoresPuntuacionesAmigos.push({
                    nombre: usuario.nombre,
                    puntuacion: puntuacion
                });
            });
        }

        mejoresPuntuacionesAmigos.sort((a, b) => b.puntuacion - a.puntuacion);

        return mejoresPuntuacionesAmigos.slice(0, 10);
    } catch (error) {
        console.error("Error en la función listarPuntuacionesDeAmigos:", error.message);
        throw new Error('Error al listar las mejores puntuaciones por país: ' + error.message);
    }
};

//METODOS DE OBJETO
// AGREGAR OBJETO
exports.agregarObjetos = async function () {
    try {
        let objetoSuperSalto = await Objeto.findOne({nombre: "Super salto"});
        if (!objetoSuperSalto) {
            await Objeto.create({nombre: "Super salto", precio: 20});
        }

        let objetoPuntuacionX2 = await Objeto.findOne({nombre: "Puntuacion x2"});
        if (!objetoPuntuacionX2) {
            await Objeto.create({nombre: "Puntuacion x2", precio: 30});
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

exports.actualizarFotoPerfil = async function(idUsuario, nombreArchivoImagen) {
    try {
        // Actualizar directamente el avatar
        return await Usuario.updateOne(
            {_id: idUsuario},
            {$set: {avatar: nombreArchivoImagen}}
        ); // Devuelve el resultado de la operación
    } catch (error) {
        throw new Error('Error al actualizar la foto de perfil: ' + error.message);
    }
};

// ENVIAR MENSAJE DE UN USUARIO A OTRO
exports.enviarMensaje = async function (fromUser, toUser, contenidoMensaje) {
    try {
        const emisor = await Usuario.findOne({ nombre: fromUser });
        const receptor = await Usuario.findOne({ nombre: toUser });

        console.log(emisor)
        console.log(receptor)

        if (!emisor) throw new Error("El usuario emisor no existe");
        if (!receptor) throw new Error("El usuario receptor no existe");

        const nuevoMensaje = new Mensaje({
            from: fromUser,
            to: toUser,
            content: contenidoMensaje
        });

        const mensajeGuardado = await nuevoMensaje.save();

        return {
            success: true,
            message: "Mensaje enviado correctamente",
            mensaje: mensajeGuardado
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};


// LISTAR MENSAJES ENTRE DOS USUARIOS
exports.obtenerConversacion = async function (usuarioA, usuarioB) {
    try {
        return await Mensaje.find({
            $or: [
                {from: usuarioA, to: usuarioB},
                {from: usuarioB, to: usuarioA}
            ]
        }).sort({timestamp: 1});
    } catch (error) {
        throw new Error("Error al obtener la conversación: " + error.message);
    }
};

//SUMAR EXPERIENCIA
exports.sumarExperiencia = async function (userId, experienciaGanada) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        usuario.experiencia += experienciaGanada;
        await usuario.save();
        return usuario;
    } catch (error) {
        throw new Error('Hubo un error al sumar experiencia: ' + error.message);
    }
};

exports.reclamarRecompensa = async function (userId, recompensaNombre, recompensaTipo, cantidad) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        if (usuario.recompensa.includes(recompensaNombre)) {
            return {
                success: false,
                message: 'Recompensa ya reclamada'
            };
        }

        switch (recompensaTipo) {
            case 'monedas':
                usuario.monedas += cantidad;
                break;
            case 'superSalto':
                usuario.superSalto += cantidad;
                break;
            case 'puntuacionExtra':
                usuario.puntuacionExtra += cantidad;
                break;
            case 'inmunidad':
                usuario.inmunidad += cantidad;
                break;
            case 'revivir':
                usuario.revivir += cantidad;
                break;
            default:
                throw new Error('Tipo de recompensa no válido');
        }

        usuario.recompensa.push(recompensaNombre);

        await usuario.save();

        return {
            success: true,
            message: `Recompensa "${recompensaNombre}" reclamada exitosamente`,
            usuario
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error al reclamar la recompensa: ' + error.message
        };
    }
};

exports.conectar = async function () {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        // 🕒 Iniciar cron aquí mismo después de conectar
        // cron.schedule('* * * * *', async () => {
        cron.schedule('0 0 1 * *', async () => {
            try {
                console.log('⏳ Reseteando experiencia y recompensas de los usuarios...');

                const result = await Usuario.updateMany({}, {
                    $set: {
                        experiencia: 0,
                        recompensa: []
                    }
                });

                console.log(`✅ Experiencia reseteada para ${result.modifiedCount} usuarios.`);
            } catch (error) {
                console.error('❌ Error al resetear experiencia:', error);
            }
        });
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
};

exports.desconectar = mongoose.disconnect;