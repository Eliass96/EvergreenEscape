document.addEventListener('DOMContentLoaded', function () {
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
        }).then((result) => {
            if (result.isConfirmed) {
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
        }).then((result) => {
            if (result.isConfirmed) {
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
});
