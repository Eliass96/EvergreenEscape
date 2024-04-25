document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('loginButton')) {
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

        async function formularioLogin() {
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

            if (!usuario.classList.contains('error') && !password.classList.contains('error')) {
                let data = {
                    nombre: usuario.value.trim(),
                    password: password.value.trim()
                }
                console.log(data.nombre);
                const res = await fetch(`/usuarios/${data.nombre}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                let usuarioEncontrado = await res.json();

                if (usuarioEncontrado !== null) {

                    const resp = await fetch("/usuarios/login", {
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
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                title: "¡El usuario no existe!",
                                showConfirmButton: true,
                                confirmButtonText: "De acuerdo",
                                confirmButtonColor: "lightgreen"
                            })

                        } else if (resp.status === 403) {
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                title: "¡La contraseña es incorrecta!",
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

                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "¡El usuario no existe!",
                        showConfirmButton: true,
                        confirmButtonText: "De acuerdo",
                        confirmButtonColor: "lightgreen"
                    })
                }
            }
        }
    }
});