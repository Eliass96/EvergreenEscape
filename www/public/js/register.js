document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('registerButton').addEventListener('click', formularioRegister);
    document.getElementById('checkboxRegister').addEventListener('click', verpasswordRegister);

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
                $('.cajaentradatexto').each(function () {
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

    function verpasswordRegister() {
        let tipo = document.getElementById("txtpassword");
        let tipoRep = document.getElementById("txtpasswordrep");
        if (tipo.type === "password" && tipoRep.type === "password") {
            tipo.type = "text";
            tipoRep.type = "text";
        } else {
            tipo.type = "password";
            tipoRep.type = "password";
        }
    }

    async function formularioRegister() {
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
            if (password.value.trim() !== passwordRep.value.trim()) {
                event.preventDefault(); // Evitar el envío del formulario
                txtPasswordRep.style.visibility = 'visible';
                passwordRep.classList.add('error');
                password.classList.add('error');
                txtPasswordRep.textContent = "La contraseña no coincide";
            } else {
                txtPasswordRep.style.visibility = 'hidden';
                passwordRep.classList.remove('error');
            }
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

        if (!usuario.classList.contains('error')
            && !dropdownMenuButton.classList.contains('error')
            && !password.classList.contains('error')
            && !passwordRep.classList.contains('error')
        ) {
            let data = {
                nombre: usuario.value.trim(),
                password: password.value.trim(),
                nacionalidad: dropdownMenuButton.textContent.trim()
            }
            console.log(data);
            const resp = await fetch("/usuarios/register", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            console.log(resp);
            if (!resp.ok) {
                console.log("No ha funcionado!")
            } else {
                console.log("Ha funcionado!")
            }
            const respJson = await resp.json();
            if (respJson.redirect) {
                window.location.href = respJson.redirect;
            }
        }
    }
})




