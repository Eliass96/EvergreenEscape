document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginButton').addEventListener('click', formularioLogin);
    document.getElementById('checkboxLogin').addEventListener('click', verpasswordLogin);

    function verpasswordLogin() {
        let tipo = document.getElementById("txtpassword");
        if (tipo.type === "password") {
            tipo.type = "text";
        } else {
            tipo.type = "password";
        }
    }

    function formularioLogin() {
        let usuario = document.getElementById('txtusuario');
        let password = document.getElementById('txtpassword');
        let txtUsuarioLogin = document.getElementById('txtFaltanDatosUsuarioLogin');
        let txtPasswordLogin = document.getElementById('txtFaltanDatosPasswordLogin');

        if (usuario.value.trim() === '') {
            event.preventDefault(); // Evitar el envío del formulario
            txtUsuarioLogin.style.visibility = 'visible';
            usuario.classList.add('error');
        } else {
            txtUsuarioLogin.style.visibility = 'hidden';
            usuario.classList.remove('error');
        }

        if (password.value.trim() === '') {
            event.preventDefault(); // Evitar el envío del formulario
            txtPasswordLogin.style.visibility = 'visible';
            password.classList.add('error');
        } else {
            txtPasswordLogin.style.visibility = 'hidden';
            password.classList.remove('error');
        }

        usuario.addEventListener('input', function () {
            if (usuario.value.trim() !== '') {
                txtUsuarioLogin.style.visibility = 'hidden';
                usuario.classList.remove('error');
            }
        });

        password.addEventListener('input', function () {
            if (password.value.trim() !== '') {
                txtPasswordLogin.style.visibility = 'hidden';
                password.classList.remove('error');
            }
        });
    }
});