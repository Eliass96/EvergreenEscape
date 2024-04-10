document.addEventListener('DOMContentLoaded', function () {

    if (document.getElementById('loginButton')) {
        document.getElementById('loginButton').addEventListener('click', formularioLogin);
        document.getElementById('checkboxLogin').addEventListener('click', verpasswordLogin);
    } else if (document.getElementById('registerButton')) {
        document.getElementById('registerButton').addEventListener('click', formularioRegister);
        document.getElementById('checkboxRegister').addEventListener('click', verpasswordRegister);
    }

    let dropdownMenuButton = document.getElementById('dropdownMenuButton');

    $(document).ready(function () {
        // Agrega un controlador de eventos al botón
        $('#dropdownMenuButton').on('click', function () {
            $('.dropdown-menu').toggleClass('show');
        });

        // Cierra el menú desplegable cuando se hace clic fuera de él
        $(document).on('click', function (e) {
            if (!$(e.target).closest('.dropdown').length) {
                $('.dropdown-menu').removeClass('show');
            } else if ($(e.target).closest('.opcionentradatexto').length) {
                $('.dropdown-menu').removeClass('show');

                dropdownMenuButton.textContent = e.target.closest('a').textContent.trim();
                document.getElementById('txtFaltanDatosNacionalidad').style.visibility = 'hidden';
                dropdownMenuButton.classList.remove('error');
                $('.cajaentradatexto').each(function() {
                    let $this = $(this);
                    if (!$this.hasClass('d-flex')) {
                        $this.addClass('d-flex');
                    }
                    if (!$this.hasClass('align-items-center')) {
                        $this.addClass('align-items-center');
                    }
                    if (!$this.hasClass('justify-content-between')) {
                        $this.addClass('justify-content-between');
                    }
                    if (!$this.hasClass('ps-3')) {
                        $this.addClass('ps-3');
                    }
                    $this.removeClass('text-end');
                });
            }
        });
    });

    function verpasswordLogin() {
        let tipo = document.getElementById("txtpassword");
        if (tipo.type === "password") {
            tipo.type = "text";
        } else {
            tipo.type = "password";
        }
    }

    function verpasswordRegister() {
        let tipo = document.getElementById("txtpassword_register");
        let tipoRep = document.getElementById("txtpasswordrep_register");
        if (tipo.type === "password" && tipoRep.type === "password") {
            tipo.type = "text";
            tipoRep.type = "text";
        } else {
            tipo.type = "password";
            tipoRep.type = "password";
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

    function formularioRegister() {
        let usuario = document.getElementById('txtusuario');
        let password = document.getElementById('txtpassword');
        let passwordRep = document.getElementById('txtpasswordrep');
        let txtUsuario = document.getElementById('txtFaltanDatosUsuario');
        let txtNacionalidad = document.getElementById('txtFaltanDatosNacionalidad');
        let txtPassword = document.getElementById('txtFaltanDatosPassword');
        let txtPasswordRep = document.getElementById('txtFaltanDatosPasswordRep');

        if (usuario.value.trim() === '') {
            event.preventDefault(); // Evitar el envío del formulario
            txtUsuario.style.visibility = 'visible';
            usuario.classList.add('error');
        } else {
            txtUsuario.style.visibility = 'hidden';
            usuario.classList.remove('error');
        }

        if (dropdownMenuButton.textContent.trim() === '') {
            event.preventDefault(); // Evitar el envío del formulario
            txtNacionalidad.style.visibility = 'visible';
            dropdownMenuButton.classList.add('error');
        } else {
            txtNacionalidad.style.visibility = 'hidden';
            dropdownMenuButton.classList.remove('error');
        }

        if (password.value.trim() === '') {
            event.preventDefault(); // Evitar el envío del formulario
            txtPassword.style.visibility = 'visible';
            password.classList.add('error');
        } else {
            txtPassword.style.visibility = 'hidden';
            password.classList.remove('error');
        }

        if (passwordRep.value.trim() === '') {
            event.preventDefault(); // Evitar el envío del formulario
            txtPasswordRep.style.visibility = 'visible';
            passwordRep.classList.add('error');
        } else {
            txtPasswordRep.style.visibility = 'hidden';
            passwordRep.classList.remove('error');
        }

        usuario.addEventListener('input', function () {
            if (usuario.value.trim() !== '') {
                txtUsuario.style.visibility = 'hidden';
                usuario.classList.remove('error');
            }
        });

        password.addEventListener('input', function () {
            if (password.value.trim() !== '') {
                txtPassword.style.visibility = 'hidden';
                password.classList.remove('error');
            }
        });

        passwordRep.addEventListener('input', function () {
            if (passwordRep.value.trim() !== '') {
                txtPasswordRep.style.visibility = 'hidden';
                passwordRep.classList.remove('error');
            }
        });
    }
});