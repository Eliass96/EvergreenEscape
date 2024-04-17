document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('butCerrarSesion').addEventListener('click', function () {
        cerrarSesion();
    });
    console.log(localStorage.getItem('isLogged'))
    let outputPerfil = document.getElementById("outputPerfil");

    try {
        let resp = await fetch(`/usuarios/${id}`);
        if (!resp.ok) {
            throw new Error("Error al cargar");
        }
        const datosUsuario = await resp.json();
       outputPerfil.innerHTML = cargarPerfil(datosUsuario._id);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "Parece que no se ha podido cargar la nota... Pruebe a reiniciar la página",
        });
    }

    function cerrarSesion() {
        window.isLogged = false;
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
});