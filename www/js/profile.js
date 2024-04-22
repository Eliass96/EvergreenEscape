document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('outputPerfil').addEventListener('click', cerrarSesion);
    let outputPerfil = document.getElementById("outputPerfil");

    try {
        let urlUsuario = '/usuarios/usuario';
        let resp = await fetch(urlUsuario);
        if (!resp.ok) {
            throw new Error("Error al cargar");
        }
        const datosUsuario = await resp.json();
        outputPerfil.innerHTML = crearPerfil(datosUsuario);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "Error inesperado al cargar el perfil... Pruebe a reiniciar la página",
        });
    }

    async function cerrarSesion(evt) {
        if (evt.target.classList.contains("botonCerrarSesion")) {
            await fetch('/usuarios/cerrarSesion', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Sesión cerrada') {
                    } else {
                        console.error('Error al cerrar sesión');
                        Swal.fire({
                            icon: "error",
                            title: "Ups...",
                            text: "Error inesperado al cargar el perfil... Pruebe a reiniciar la página",
                        });
                    }
                })
                .catch(error => console.error(error));
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
        }
    }
});