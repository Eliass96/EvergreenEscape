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
        $('#modalFriendRequest').modal({backdrop: 'static', keyboard: false}).modal('show');

        $(document.getElementById("but_solicitudes")).modal('hide');
    }, this);

    document.getElementById("boton_cerrar").addEventListener("click", function () {
        $("#modalFriendRequest").modal("hide");
    });


    try {
        let urlUsuario = '/usuarios/usuario';
        let resp = await fetch(urlUsuario);
        if (resp.ok) {
            const datosUsuario = await resp.json();
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
            text: "Error inesperado al cargar el listado de amigos... Pruebe a reiniciar la página",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        }).then(() => {
            console.log(error)
           // document.location.href = "/"
        });
    }

    let usuarios;

    try {
        let urlUsuario = '/usuarios';
        let resp = await fetch(urlUsuario);

        if (resp.ok) {
            usuarios = await resp.json();

            outputFriendsAddList.innerHTML = friendsAddList({usuarios: usuarios});
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
            text: "Error inesperado al cargar el listado de amigos... Pruebe a reiniciar la página",
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

        busqueda = busqueda.replace(/[a-zA-Z]/g, function(match) {
            return match.toLowerCase();
        });

        const usuariosFiltrados = usuarios.filter(usuario => {
            const nombreUsuario = usuario.nombre.replace(/[a-zA-Z]/g, function(match) {
                return match.toLowerCase();
            });

            return nombreUsuario.includes(busqueda);
        });

        actualizarListaUsuarios(usuariosFiltrados);
    });

    async function gestionarSolicitudes(evt) {
        if (evt.target.classList.contains("boton_aceptar")) {
            let friendName = evt.target.parentElement.parentElement.querySelector("p").textContent
            console.log(friendName);
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
                }).then(() => {
                    window.location.reload();
                })
            }
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
                Swal.fire({
                    icon: "error",
                    title: "Ups...",
                    text: "Error inesperado al mandar solicitud de amigo... Pruebe a reiniciar la página",
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
                    title: "¡Solicitud de amistad enviada!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                }).then(() => {
                    window.location.reload();
                })
            }
        }
    }

    async function eliminarAmigo(evt) {
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
                    //window.location.reload();
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
    }
})