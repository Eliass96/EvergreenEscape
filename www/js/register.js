document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('registerButton').addEventListener('click', formularioRegister);
    document.getElementById('checkboxRegister').addEventListener('click', verpasswordRegister);
    document.getElementById('registerButtonGoogle').addEventListener('click', registerGoogle);
    document.addEventListener('keyup', async (event) => {
        if (event.key === 'Escape') {
            window.location = '/';
            return;
        }

        if (event.key === 'Enter') {
            const activeElement = document.activeElement;

            if (activeElement.tagName === 'INPUT') {
                const inputType = activeElement.getAttribute('type');
                if (inputType === 'checkbox') {
                    activeElement.checked = !activeElement.checked;
                    verpasswordRegister();
                } else {
                    await formularioRegister();
                }
            } else {
                await formularioRegister();
            }
        }
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

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Regex para email válido

        // Validación de Email
        if (email.value.trim() === '') {
            event.preventDefault();
            txtEmail.style.visibility = 'visible';
            email.classList.add('error');
        } else if (!emailRegex.test(email.value.trim())) {
            event.preventDefault();
            txtEmail.style.visibility = 'visible';
            txtEmail.textContent = "Correo electrónico inválido";
            email.classList.add('error');
        } else {
            txtEmail.style.visibility = 'hidden';
            email.classList.remove('error');
        }

        // Validación de Usuario
        if (usuario.value.trim() === '') {
            event.preventDefault();
            txtUsuario.style.visibility = 'visible';
            usuario.classList.add('error');
        } else {
            txtUsuario.style.visibility = 'hidden';
            usuario.classList.remove('error');
        }

        // Validación de Nacionalidad
        if (dropdownMenuButton.textContent.trim() === '') {
            event.preventDefault();
            txtNacionalidad.style.visibility = 'visible';
            dropdownMenuButton.classList.add('error');
        } else {
            txtNacionalidad.style.visibility = 'hidden';
            dropdownMenuButton.classList.remove('error');
        }

        // Validación de Contraseña
        if (password.value.trim() === '') {
            event.preventDefault();
            txtPassword.style.visibility = 'visible';
            password.classList.add('error');
        } else {
            txtPassword.style.visibility = 'hidden';
            password.classList.remove('error');
        }

        // Validación de Repetición de Contraseña
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

        // Eventos de Input
        usuario.addEventListener('input', function () {
            if (usuario.value.trim() !== '') {
                txtUsuario.style.visibility = 'hidden';
                usuario.classList.remove('error');
            }
        });

        email.addEventListener('input', function () {
            if (email.value.trim() !== '' && emailRegex.test(email.value.trim())) {
                txtEmail.style.visibility = 'hidden';
                email.classList.remove('error');
            } else if (email.value.trim() !== '' && !emailRegex.test(email.value.trim())) {
                txtEmail.style.visibility = 'visible';
                txtEmail.textContent = "Correo electrónico inválido";
                email.classList.add('error');
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

        // Verificación final y envío
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
                nacionalidad: getSelectedNacionalidad()
            };

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
                    });
                } else if (resp.status === 409) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "¡Este nombre de usuario o email ya existe!",
                        showConfirmButton: true,
                        confirmButtonText: "De acuerdo",
                        confirmButtonColor: "lightgreen"
                    });
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "¡Error al registrarte!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                    });
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
                        email: email.value.trim(),
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

                        document.location.href = "/";
                    } catch (error) {
                        console.error("Se produjo un error al iniciar sesión:", error);
                    }
                });
            }
        }
    }
});