document.addEventListener('DOMContentLoaded', function () {
    cargarAjustes();

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
    const checkboxMusica = document.getElementById('bauble_check_musica');
    const checkboxSonido = document.getElementById('bauble_check_sonido');
    const checkboxPantallaCompleta = document.getElementById('bauble_check_pantalla_completa');
    async function guardarAjustes() {
        const data = {
            valorMusica: !checkboxMusica.checked,
            valorSonido: !checkboxSonido.checked,
            valorPantallaCompleta: !checkboxPantallaCompleta.checked
        };
        console.log(data);
        const response = await fetch('/usuarios/ajustes/usuario', {
            credentials: 'include',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    async function cargarAjustes() {
        const respUsuario = await fetch('/usuarios/usuario');
        if (respUsuario.status !== 200) {
            throw new Error("Error al cargar");
        }
        let usuario = await respUsuario.json();

        checkboxMusica.checked = !usuario.musica;
        checkboxSonido.checked = !usuario.sonido;
        checkboxPantallaCompleta.checked = !usuario.pantallaCompleta;
    }
});
