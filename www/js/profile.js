document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('outputPerfil').addEventListener('click', cerrarSesion);
    let outputPerfil = document.getElementById("outputPerfil");

    try {
        let urlUsuario = '/usuarios/usuario';
        let resp = await fetch(urlUsuario);
        if (resp.ok) {
            const datosUsuario = await resp.json();
            outputPerfil.innerHTML = crearPerfil(datosUsuario);
        } else {
            Swal.fire({
                icon: "warning",
                title: "No has iniciado sesión",
                text: "¡Tienes que iniciar sesión para poder acceder al perfil!",
                confirmButtonText: "Aceptar"
            }).then(() => {
                document.location.href = "../html/login.html";
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "Error inesperado al cargar el perfil... Pruebe a reiniciar la página",
        }).then(() => {
            document.location.href = "/"
        });
    }

    async function cerrarSesion(evt) {
        if (evt.target.classList.contains("botonCerrarSesion")) {
            let resp = await fetch('/usuarios/cerrarSesion', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!resp.ok) {
                console.log(resp);
                throw new Error("Error al cargar");
            } else {
                const data = await resp.json();
                console.log(data)
                if (data.message === 'Sesión cerrada') {
                    document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "¡Has cerrado sesión!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                    }).then(() => {
                        document.location.href = "/"
                    })
                } else {
                    console.error('Error al cerrar sesión');
                    Swal.fire({
                        icon: "error",
                        title: "Ups...",
                        text: "Error inesperado al cargar el perfil... Pruebe a reiniciar la página",
                    }).then(() => {
                        document.location.href = "/"
                    });
                }
            }
        }
    }
});