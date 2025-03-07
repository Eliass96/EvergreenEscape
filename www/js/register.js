document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('registerButton').addEventListener('click', formularioRegister);
    document.getElementById('checkboxRegister').addEventListener('click', verpasswordRegister);
    document.getElementById('registerButtonGoogle').addEventListener('click', registerGoogle);

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.location = '../index.html';
        }
    });

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

    async function registerGoogle() {
        window.location.href = '/auth/google';
    }


    async function formularioRegister() {
        let usuario = document.getElementById('txtusuario');
        let email = document.getElementById('txtemail');
        let password = document.getElementById('txtpassword');
        let passwordRep = document.getElementById('txtpasswordrep');
        let txtUsuario = document.getElementById('txtFaltanDatosUsuario');
        let txtEmail = document.getElementById('txtFaltanDatosEmail');
        let txtNacionalidad = document.getElementById('txtFaltanDatosNacionalidad');
        let txtPassword = document.getElementById('txtFaltanDatosPassword');
        let txtPasswordRep = document.getElementById('txtFaltanDatosPasswordRep');

        if (email.value.trim() === '') {
            event.preventDefault();
            txtEmail.style.visibility = 'visible';
            email.classList.add('error');
        } else {
            txtEmail.style.visibility = 'hidden';
            email.classList.remove('error');
        }

        if (usuario.value.trim() === '') {
            event.preventDefault();
            txtUsuario.style.visibility = 'visible';
            usuario.classList.add('error');
        } else {
            txtUsuario.style.visibility = 'hidden';
            usuario.classList.remove('error');
        }

        if (dropdownMenuButton.textContent.trim() === '') {
            event.preventDefault();
            txtNacionalidad.style.visibility = 'visible';
            dropdownMenuButton.classList.add('error');
        } else {
            txtNacionalidad.style.visibility = 'hidden';
            dropdownMenuButton.classList.remove('error');
        }

        if (password.value.trim() === '') {
            event.preventDefault();
            txtPassword.style.visibility = 'visible';
            password.classList.add('error');
        } else {
            txtPassword.style.visibility = 'hidden';
            password.classList.remove('error');
        }

        if (passwordRep.value.trim() === '') {
            event.preventDefault();
            txtPasswordRep.style.visibility = 'visible';
            passwordRep.classList.add('error');
        } else {
            txtPasswordRep.style.visibility = 'hidden';
            passwordRep.classList.remove('error');
            if (password.value.trim() !== passwordRep.value.trim()) {
                event.preventDefault();
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

        email.addEventListener('input', function () {
            if (email.value.trim() !== '') {
                txtEmail.style.visibility = 'hidden';
                email.classList.remove('error');
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
            && !email.classList.contains('error')
            && !dropdownMenuButton.classList.contains('error')
            && !password.classList.contains('error')
            && !passwordRep.classList.contains('error')
        ) {
            let data = {
                nombre: usuario.value.trim(),
                email: email.value.trim(),
                password: password.value.trim(),
                nacionalidad: dropdownMenuButton.textContent.trim()
            }

            const resp = await fetch("/usuarios/registro", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            if (!resp.ok) {
                if (resp.status === 400) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "¡Faltan datos por introducir!",
                        showConfirmButton: true,
                        confirmButtonText: "De acuerdo",
                        confirmButtonColor: "lightgreen"
                    })
                } else if (resp.status === 409) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "¡Este usuario ya existe!",
                        showConfirmButton: true,
                        confirmButtonText: "De acuerdo",
                        confirmButtonColor: "lightgreen"
                    })
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "¡Error al registrarte!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                    })
                }
            } else {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Te has registrado correctamente!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                }).then(async () => {
                    let dataLogin = {
                        email: usuario.value.trim(),
                        password: password.value.trim()
                    };
                    try {
                        let respLogin = await fetch("/usuarios/logueo", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(dataLogin)
                        });

                        if (!respLogin.ok) {
                            throw new Error("Error en la solicitud");
                        }

                        let respJson = await respLogin.json();

                        document.location.href = "/";
                    } catch (error) {
                        console.error("Se produjo un error al iniciar sesión:", error);
                    }
                });
            }
        }
    }
});