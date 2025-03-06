
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('confirmDataButton').addEventListener('click', formularioRegister);

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
                nacionalidad: dropdownMenuButton.textContent.trim()
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
                    let dataLoginGoogle = {

                    };
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