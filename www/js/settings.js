document.addEventListener('DOMContentLoaded', async function () {
    const checkboxMusica = document.getElementById('bauble_check_musica');
    const checkboxSonido = document.getElementById('bauble_check_sonido');
    let musicaCambiado = false;
    let sonidoCambiado = false;
    let usuario;

    if (document.getElementById('but_cancelar_ajustes')) {
        let but_cancelar_ajustes = document.getElementById('but_cancelar_ajustes');
        but_cancelar_ajustes.addEventListener('click', function () {
            cancelarAjustes();
        });
    }

    if (document.getElementById('but_aceptar_ajustes')) {
        let but_aceptar_ajustes = document.getElementById('but_aceptar_ajustes');
        but_aceptar_ajustes.addEventListener('click', function () {
            confirmarAjustes();
        });
    }

    if (document.getElementById('gameSettings')) {
        let but_cambiar_fondo = document.getElementById('gameSettings');
        but_cambiar_fondo.addEventListener('click', function () {
            cambiarFondo();
        });
    }

    try {
        let urlUsuario = '/usuarios/usuario';
        let resp = await fetch(urlUsuario);
        if (resp.ok) {
            await cargarAjustes();
        } else {
            Swal.fire({
                icon: "warning",
                title: "No has iniciado sesión",
                text: "¡Tienes que iniciar sesión para poder acceder a los ajustes!",
                confirmButtonText: "Aceptar"
            }).then(() => {
                document.location.href = "../html/login.html";
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "Error inesperado al cargar los ajustes... Pruebe a reiniciar la página",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        }).then(() => {
            document.location.href = "/"
        });
    }

    function confirmarAjustes() {
        Swal.fire({
            title: "¿Quieres guardar los ajustes?",
            icon: "question",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            denyButtonText: "Salir sin guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "lightgreen",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await guardarAjustes();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Ajustes guardados!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                }).then(() => {
                    document.location.href = "/"
                })
            } else if (result.isDenied) {
                window.location.href = "/";
            }
        });
    }

    function cancelarAjustes() {
        Swal.fire({
            title: "¿Quieres salir sin guardar los ajustes?",
            icon: "warning",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            denyButtonText: "Salir sin guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "lightgreen",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await guardarAjustes();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Ajustes guardados!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                }).then(() => {
                    document.location.href = "/"
                })
            } else if (result.isDenied) {
                window.location.href = "/";
            }

        });
    }

    async function guardarAjustes() {
        try {
            const data = {
                valorMusica: !checkboxMusica.checked,
                valorSonido: !checkboxSonido.checked
            };
            await fetch('/usuarios/usuario/ajustes', {
                credentials: 'include',
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error inesperado al guardar los ajustes",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        }
    }

    async function cargarAjustes() {
        try {
            const respUsuario = await fetch('/usuarios/usuario');
            if (respUsuario.status !== 200) {
                throw new Error("Error al cargar");
            }
            usuario = await respUsuario.json();

            checkboxMusica.checked = !usuario.musica;
            checkboxSonido.checked = !usuario.sonido;

            musicaCambiado = !usuario.musica;
            sonidoCambiado = !usuario.sonido;


        } catch (error) {
            console.error('Error al intentar cargar los ajustes:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error inesperado al cargar los ajustes",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        }
    }

    async function cambiarFondo() {
        if (musicaCambiado !== checkboxMusica.checked || sonidoCambiado !== checkboxSonido.checked) {
            Swal.fire({
                title: "¿Quieres guardar los cambios realizados?",
                icon: "warning",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Guardar",
                denyButtonText: "No guardar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "lightgreen",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await guardarAjustes();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "¡Ajustes guardados!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                    }).then(() => {
                        window.location.href = "../html/gameSettings.html";
                    })
                } else if (result.isDenied) {
                    window.location.href = "../html/gameSettings.html";
                }

            });
        } else {
            window.location.href = "../html/gameSettings.html";
        }
    }
});
