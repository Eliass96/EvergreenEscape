document.addEventListener('DOMContentLoaded', async function () {

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.location = '/';
        }
    });

    document.getElementById('outputFriendsList').addEventListener('click', eliminarAmigo)
    document.getElementById('outputFriendsAddList').addEventListener('click', addAmigo)

    try {
        let urlUsuario = '/usuarios/usuario';
        let resp = await fetch(urlUsuario);
        if (resp.ok) {
            const datosUsuario = await resp.json();
            outputFriendsList.innerHTML = friendsList({amigos: datosUsuario.amigos});
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
                // document.location.href = "/login";
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


    document.getElementById("buscador").addEventListener('input', function (event) {
        const busqueda = event.target.value.toLowerCase();  // Obtenemos el valor del input en minúsculas

        // Filtramos los usuarios que contienen el texto ingresado
        const usuariosFiltrados = usuarios.filter(usuario => {
            return usuario.nombre.toLowerCase().includes(busqueda);
        });

        // Actualizamos la lista de usuarios en el DOM
        actualizarListaUsuarios(usuariosFiltrados);
    });

// Función que actualiza la lista de usuarios en la interfaz
    function actualizarListaUsuarios(usuariosFiltrados) {
        const listaUsuarios = document.querySelector('.lista_users');

        // Limpiamos la lista actual de usuarios
        listaUsuarios.innerHTML = '';

        // Iteramos sobre los usuarios filtrados y los agregamos al DOM
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


    async function addAmigo(evt) {
        if (evt.target.classList.contains("boton_anadir")) {

        }
    }

    async function eliminarAmigo(evt) {
        if (evt.target.classList.contains("boton_eliminar")) {
            let friendName = evt.target.parentElement.parentElement.querySelector("p").textContent
            let resp = await fetch(`/usuarios/amigos/${friendName}`, {
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
        }
    }
})