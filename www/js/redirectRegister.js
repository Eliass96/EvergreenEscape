document.addEventListener('DOMContentLoaded', async function () {
    fetch('/usuarios/logueo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({provider: 'google'})
    })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "El usuario ya existe",
                    text: "Se iniciará sesión automáticamente.",
                    showConfirmButton: true,
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "¡Has iniciado sesión!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                    }).then(() => {
                        document.location.href = "/"
                    })
                });
            } else {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "¡Usuario no encontrado!",
                    text: "¿Deseas registrarte para continuar?",
                    showCancelButton: true,
                    animation: true,
                    confirmButtonColor: "lightgreen",
                    cancelButtonColor: "#e74c3c",
                    confirmButtonText: "Sí, registrarme",
                    cancelButtonText: "No, cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/completeData";
                    } else {
                        window.location.href = "/login";
                    }
                });
            }
        })
        .catch(error => console.error('Error en la solicitud:', error));
});