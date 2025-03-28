document.addEventListener('DOMContentLoaded', async function () {
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.location = '/';
        }
    });


    document.getElementById('outputFriendsList').addEventListener('click', eliminarAmigo)
    document.getElementById('outputFriendsAddList').addEventListener('click', enviarSolicitud)
    document.getElementById('outputCardSolicitudes').addEventListener('click', gestionarSolicitudes)
    document.getElementById("but_solicitudes").addEventListener('click', async function () {
        // Ocultar los contenedores
        document.getElementById("outputFriendsList").classList.add('d-none');
        document.getElementById("outputFriendsAddList").classList.add('d-none');

        // Abrir el modal
        $('#modalFriendRequest').modal({backdrop: 'static', keyboard: false}).modal('show');

        // Ocultar el botón de solicitudes
        $(document.getElementById("but_solicitudes")).modal('hide');
    }, this);

    let botonCerrar = document.getElementById("boton_cerrar");

    if (botonCerrar) {
        botonCerrar.addEventListener("click", function () {
            // Cerrar el modal
            $("#modalFriendRequest").modal("hide");

            // Mostrar los contenedores nuevamente
            document.getElementById("outputFriendsList").classList.remove('d-none');
            document.getElementById("outputFriendsAddList").classList.remove('d-none');
        });
    }

    let datosUsuario;
    let usuarios;

    async function getUsuario() {
        try {
            let urlUsuario = '/usuarios/usuario';
            let resp = await fetch(urlUsuario);
            if (resp.ok) {
                datosUsuario = await resp.json();
                outputFriendsList.innerHTML = friendsList({amigos: datosUsuario.amigos});
                outputCardSolicitudes.innerHTML = friendsRequest({solicitudes: datosUsuario.solicitudesAmistad});
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "No has iniciado sesión",
                    text: "¡Tienes que iniciar sesión para poder acceder al listado de amigos!",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    document.location.href = "/login";
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ups...",
                text: "Error inesperado al cargar los amigos... Pruebe a reiniciar la página",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            }).then(() => {
                console.log(error)
                document.location.href = "/"
            });
        }
    }

    await getUsuario();

    try {
        let urlUsuario = '/usuarios';
        let resp = await fetch(urlUsuario);

        if (resp.ok) {
            usuarios = await resp.json();

            outputFriendsAddList.innerHTML = friendsAddList({usuarios: usuarios, datosUsuario: datosUsuario});
        } else {
            Swal.fire({
                icon: "warning",
                title: "No has iniciado sesión",
                text: "¡Tienes que iniciar sesión para poder acceder al listado de amigos!",
                confirmButtonText: "Aceptar"
            }).then(() => {
                document.location.href = "/login";
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "Error inesperado al cargar el listado de usuarios... Pruebe a reiniciar la página",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        }).then(() => {
            console.log(error)
            document.location.href = "/"
        });
    }

    document.getElementById("buscador").addEventListener('input', function (event) {
        let busqueda = event.target.value;

        busqueda = busqueda.replace(/[a-zA-Z]/g, function (match) {
            return match.toLowerCase();
        });

        const usuariosFiltrados = usuarios.filter(usuario => {
            const nombreUsuario = usuario.nombre.replace(/[a-zA-Z]/g, function (match) {
                return match.toLowerCase();
            });

            return nombreUsuario.includes(busqueda);
        });

        actualizarListaUsuarios(usuariosFiltrados);
    });

    async function gestionarSolicitudes(evt) {
        try {
            if (evt.target.classList.contains("boton_aceptar")) {
                let friendName = evt.target.parentElement.parentElement.querySelector("p").textContent
                let resp = await fetch(`/usuarios/amigos/agregar/${friendName}`, {
                    credentials: 'include',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!resp.ok) {
                    Swal.fire({
                        icon: "error",
                        title: "Ups...",
                        text: "Error inesperado al agregar amigo... Pruebe a reiniciar la página",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "¡Amigo añadido correctamente!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                    }).then(async () => {
                        await getUsuario();
                    })
                }
            } else if (evt.target.classList.contains("boton_rechazar")) {
                let friendName = evt.target.parentElement.parentElement.querySelector("p").textContent
                console.log(friendName);
                let resp = await fetch(`/usuarios/solicitudes/rechazar/${friendName}`, {
                    credentials: 'include',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!resp.ok) {
                    Swal.fire({
                        icon: "error",
                        title: "Ups...",
                        text: "Error inesperado al rechazar la solicitud... Pruebe a reiniciar la página",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                    }).then(() => {
                        //window.location.reload();
                    });
                } else {
                    window.location.reload();
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    function actualizarListaUsuarios(usuariosFiltrados) {
        const listaUsuarios = document.querySelector('.lista_users');
        listaUsuarios.innerHTML = '';
        usuariosFiltrados.forEach(usuario => {
            const li = document.createElement('li');
            li.classList.add('texto_users', 'd-flex', 'align-items-center', 'justify-content-between');

            const p = document.createElement('p');
            p.textContent = usuario.nombre;

            const boton = document.createElement('button');
            boton.classList.add('btn', 'btn-custom', 'boton_anadir');
            boton.textContent = '➕';
            boton.id = 'boton_anadir';

            li.appendChild(p);
            li.appendChild(boton);
            listaUsuarios.appendChild(li);
        });
    }

    async function enviarSolicitud(evt) {
        try {
            if (evt.target.classList.contains("boton_anadir")) {
                let friendName = evt.target.parentElement.querySelector("p").textContent
                console.log(friendName);
                let resp = await fetch(`/usuarios/solicitudes/${friendName}`, {
                    credentials: 'include',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!resp.ok) {
                    if (resp.status === 409) {
                        Swal.fire({
                            icon: "error",
                            title: "Ups...",
                            text: "Ya se ha enviado una solicitud a ese usuario o ya es tu amigo.",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                        })
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Ups...",
                            text: "Error inesperado al mandar solicitud de amigo... Pruebe a reiniciar la página",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                        })
                    }
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "¡Solicitud de amistad enviada!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                    }).then(() => {
                        window.location.reload();
                    })
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function eliminarAmigo(evt) {
        try {
            if (evt.target.classList.contains("boton_eliminar")) {
                let friendName = evt.target.parentElement.parentElement.querySelector("p").textContent
                let resp = await fetch(`/usuarios/amigos/eliminar/${friendName}`, {
                    credentials: 'include',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!resp.ok) {
                    Swal.fire({
                        icon: "error",
                        title: "Ups...",
                        text: "Error inesperado al eliminar el amigo... Pruebe a reiniciar la página",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        title: "¿Estás seguro de que quieres eliminar a este amigo?",
                        icon: "warning",
                        showDenyButton: true,
                        animation: true,
                        confirmButtonText: "Si",
                        denyButtonText: "No",
                        confirmButtonColor: "lightgreen",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "¡Amigo eliminado!",
                                showConfirmButton: false,
                                timer: 1000,
                                timerProgressBar: true,
                            }).then(() => {
                                window.location.reload();
                            })
                        }

                    });
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
})