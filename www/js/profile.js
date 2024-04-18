document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('outputPerfil').addEventListener('click', cerrarSesion);
    console.log(localStorage.getItem('isLogged'))
    let outputPerfil = document.getElementById("outputPerfil");

    try {
        let idUsuario = localStorage.getItem('isLogged');
        let urlUsuario = `/usuarios/${idUsuario}`;
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

    function cerrarSesion(evt) {
        console.log("1")
        if (evt.target.classList.contains("botonCerrarSesion")) {
            console.log("2")
            window.isLogged = null;
            localStorage.setItem('isLogged', window.isLogged);
            document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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