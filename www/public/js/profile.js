document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('butCerrarSesion').addEventListener('click', function () {
        cerrarSesion();
    });
    console.log(localStorage.getItem('isLogged'))
    function cerrarSesion() {
        window.isLogged = false;
        localStorage.setItem('isLogged', window.isLogged);
        console.log(localStorage.getItem('isLogged'))
    }
});