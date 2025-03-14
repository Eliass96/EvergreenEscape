document.addEventListener('DOMContentLoaded', async function () {

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.location = '/';
        }
    });

    document.getElementById('outputFriendsList').addEventListener('click', eliminarAmigo)

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