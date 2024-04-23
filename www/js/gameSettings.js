

document.addEventListener('DOMContentLoaded', async function () {
    let fondo;

    botonFondoClaro = document.getElementById('botonFondoClaro');
    botonFondoOscuro = document.getElementById('botonFondoOscuro');

    const respUsuario = await fetch('/usuarios/usuario');
    if (respUsuario.status !== 200) {
        throw new Error("Error al cargar");
    }
    let usuario = await respUsuario.json();
    fondo = usuario.fondoClaro;


    botonFondoClaro.addEventListener('click', function () {
        fondo = true;
        guardarFondo();
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Fondo claro guardado correctamente!",
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
            title: "Fondo oscuro guardado correctamente!",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true
        });

    })

    async function guardarFondo() {
        try {
            const data = {
                fondoJuego: fondo
            };
            const response = await fetch('/usuarios/partida/usuario', {
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