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
                    icon: "success",
                    title: "¡Has iniciado sesión!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                }).then(() => {
                    document.location.href = "/"
                })
            } else {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "¡Usuario no encontrado!",
                    text: "Por favor, regístrate para continuar.",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                }).then(() => {
                    window.location.href = '/html/completeData.html';
                })
            }
        })
        .catch(error => console.error('Error en la solicitud:', error));
});