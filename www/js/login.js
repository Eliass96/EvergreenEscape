document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('loginButton')) {
        document.getElementById('loginButton').addEventListener('click', formularioLogin);
        document.getElementById('checkboxLogin').addEventListener('click', verpasswordLogin);
        document.getElementById('loginButtonGoogle').addEventListener('click', loginGoogle);
        document.addEventListener('keyup', async (event) => {
            if (event.key === 'Escape') {
                window.location = '/';
            }
            if (event.key === 'Enter') {
                await formularioLogin();
            }
        });

        function verpasswordLogin() {

            let tipo = document.getElementById("txtpassword");
            if (tipo.type === "password") {
                tipo.type = "text";
            } else {
                tipo.type = "password";
            }
        }

        async function loginGoogle() {
            window.location.href = '/auth/google';
        }

        async function formularioLogin() {
            let usuario = document.getElementById('txtusuario');
            let password = document.getElementById('txtpassword');
            let txtUsuarioLogin = document.getElementById('txtFaltanDatosUsuarioLogin');
            let txtPasswordLogin = document.getElementById('txtFaltanDatosPasswordLogin');

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Regex para email válido

            if (usuario.value.trim() === '') {
                event.preventDefault();
                txtUsuarioLogin.style.visibility = 'visible';
                usuario.classList.add('error');
            } else if (!emailRegex.test(usuario.value.trim())) {
                event.preventDefault();
                txtUsuarioLogin.style.visibility = 'visible';
                txtUsuarioLogin.textContent = "Correo electrónico inválido";
                usuario.classList.add('error');
            } else {
                txtUsuarioLogin.style.visibility = 'hidden';
                usuario.classList.remove('error');
            }

            if (password.value.trim() === '') {
                event.preventDefault();
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

            if (!usuario.classList.contains('error') && !password.classList.contains('error')) {
                let data = {
                    email: usuario.value.trim(),
                    password: password.value.trim()
                }
                console.log(data);

                const resp = await fetch("/usuarios/logueo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
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
                    } else if (resp.status === 401) {
                        resp.json().then(data => {
                            const provider = data.provider;
                            console.log(provider);
                            if (provider==="normal") {
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: "Este usuario no existe",
                                    showConfirmButton: true,
                                    confirmButtonText: "De acuerdo",
                                    confirmButtonColor: "lightgreen"
                                });
                            } else if (provider==="google") {
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: "Este usuario no existe, ¿Quieres crear uno nuevo?",
                                    showCancelButton: true,
                                    animation: true,
                                    cancelButtonColor: "#e74c3c",
                                    confirmButtonText: "Aceptar",
                                    cancelButtonText: "Cancelar",
                                    confirmButtonColor: "lightgreen"
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        // Redirigir a la pantalla deseada
                                        window.location.href = "/completeData";
                                    }
                                });
                            }

                        }).catch(err => {
                            console.error("Error al parsear la respuesta:", err);
                        });
                    } else if (resp.status === 403) {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "¡Contraseña incorrecta!",
                            showConfirmButton: true,
                            confirmButtonText: "De acuerdo",
                            confirmButtonColor: "lightgreen"
                        })
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "¡Error al iniciar sesión!",
                            showConfirmButton: false,
                            timer: 1000,
                            timerProgressBar: true,
                        })
                    }
                } else {
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
                }
            }
        }
    }
});