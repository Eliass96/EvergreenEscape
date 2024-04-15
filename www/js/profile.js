document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('butCerrarSesion').addEventListener('click', function () {
        cerrarSesion();
    });
    console.log(localStorage.getItem('isLogged'))
    function cerrarSesion() {
        window.isLogged = false;
        localStorage.setItem('isLogged', window.isLogged);
        document.cookie ='jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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