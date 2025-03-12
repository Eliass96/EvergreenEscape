document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('confirmDataButton').addEventListener('click', formularioRegister);

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.location = '/';
        }
    });

    async function formularioRegister() {
        let usuario = document.getElementById('txtusuario');
        let txtUsuario = document.getElementById('txtFaltanDatosUsuario');
        let txtNacionalidad = document.getElementById('txtFaltanDatosNacionalidad');

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

        usuario.addEventListener('input', function () {
            if (usuario.value.trim() !== '') {
                txtUsuario.style.visibility = 'hidden';
                usuario.classList.remove('error');
            }
        });

        if (!usuario.classList.contains('error')
            && !dropdownMenuButton.classList.contains('error')
        ) {
            let data = {
                nombre: usuario.value.trim(),
                nacionalidad: getSelectedNacionalidad()
            }

            const resp = await fetch("/usuarios/completarDatos", {
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
                    let dataLoginGoogle = {};
                    console.log(dataLoginGoogle);
                    try {

                        const respLogin = await fetch("/usuarios/logueo", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(dataLoginGoogle)
                        });

                        console.log(respLogin);

                        if (!respLogin.ok) {
                            throw new Error("Error en la solicitud");
                        }

                        let respJson = await respLogin.json();
                        console.log(respJson);

                        document.location.href = "/";
                    } catch (error) {
                        console.error("Se produjo un error al iniciar sesión:", error);
                    }
                });
            }
        }
    }
});