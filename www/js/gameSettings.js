let fondo;
document.addEventListener('DOMContentLoaded', async function () {

    let botonFondoClaro = document.getElementById('botonFondoClaro');
    let botonFondoOscuro = document.getElementById('botonFondoOscuro');

    try {
        let urlUsuario = '/usuarios/usuario';
        let resp = await fetch(urlUsuario);
        if (resp.ok) {
            let usuario = await resp.json();
            fondo = usuario.fondoClaro;
            botonFondoClaro.addEventListener('click', function () {
                fondo = true;
                guardarFondo();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Fondo claro aplicado correctamente!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true
                });
            })

            botonFondoOscuro.addEventListener('click', function () {
                fondo = false;
                guardarFondo();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Fondo oscuro aplicado correctamente!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true
                });

            })
        } else {
            Swal.fire({
                icon: "warning",
                title: "No has iniciado sesión",
                text: "¡Tienes que iniciar sesión para poder acceder a los ajustes de fondo!",
                confirmButtonText: "Aceptar"
            }).then(() => {
                document.location.href = "../html/login.html";
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "Error inesperado al cargar los ajustes de fondo... Pruebe a reiniciar la página",
        }).then(() => {
            document.location.href = "/"
        });
    }

    async function guardarFondo() {
        try {
            const data = {
                fondoJuego: fondo
            };
            await fetch('/usuarios/usuario/fondoPartida', {
                credentials: 'include',
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Error al intentar guardar el fondo:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error inesperado al guardar el fondo"
            });
        }
    }
});