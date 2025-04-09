document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('outputPerfil').addEventListener('change', accionesPerfil);

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.location = '/';
        }
    });


    let outputPerfil = document.getElementById("outputPerfil");

    try {
        let urlUsuario = '/usuarios/usuario';
        let resp = await fetch(urlUsuario);
        if (resp.ok) {
            const datosUsuario = await resp.json();
            console.log(datosUsuario);
            outputPerfil.innerHTML = crearPerfil(datosUsuario);

            let cropper;

            const avatar = document.getElementById('avatar');
            const input = document.getElementById('avatarInput');
            const cropperImage = document.getElementById('cropperImage');
            const cropperModal = new bootstrap.Modal(document.getElementById('cropperModal'));

            avatar.addEventListener('click', () => input.click());

            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    cropperImage.src = reader.result;
                    cropperModal.show();

                    setTimeout(() => {
                        if (cropper) cropper.destroy();
                        cropper = new Cropper(cropperImage, {
                            aspectRatio: 1,
                            viewMode: 1,
                        });
                    }, 300);
                };
                reader.readAsDataURL(file);
            });

            document.getElementById('cropImageBtn').addEventListener('click', () => {
                if (cropper) {
                    const canvas = cropper.getCroppedCanvas({
                        width: 300,
                        height: 300,
                    });

                    avatar.src = canvas.toDataURL();
                    cropperModal.hide();
                }
            });

        } else {
            Swal.fire({
                icon: "warning",
                title: "No has iniciado sesión",
                text: "¡Tienes que iniciar sesión para poder acceder al perfil!",
                confirmButtonText: "Aceptar"
            }).then(() => {
                document.location.href = "/login";
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "Error inesperado al cargar el perfil... Pruebe a reiniciar la página",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        }).then(() => {
            document.location.href = "/"
        });
    }

    async function accionesPerfil(evt) {
        if (evt.target.classList.contains("botonCerrarSesion")) {
            let resp = await fetch('/usuarios/cerrarSesion', {
                credentials: 'include',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!resp.ok) {
                throw new Error("Error al cargar");
            } else {
                const data = await resp.json();
                if (data.message === 'Sesión cerrada') {
                    document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "¡Has cerrado sesión!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                    }).then(() => {
                        document.location.href = "/"
                    })
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Ups...",
                        text: "Error inesperado al cargar el perfil... Pruebe a reiniciar la página",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                    }).then(() => {
                        document.location.href = "/"
                    });
                }
            }
        } else if (evt.target.classList.contains("avatar-input")) {
            try {
                // Obtener el archivo de la imagen desde el input
                const archivo = evt.target.files[0];
                console.log(evt.target.files[0]);

                if (!archivo) {
                    alert("No se ha seleccionado ninguna imagen.");
                    return;
                }

                const tipoArchivo = archivo.type;
                const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'];

                if (!tiposPermitidos.includes(tipoArchivo)) {
                    alert("Formato de archivo no permitido. Solo imágenes PNG, JPG y JPEG.");
                    return;
                }

                // Mostrar la imagen seleccionada antes de enviar (opcional)
                const reader = new FileReader();
                reader.onload = function (event) {
                    // Mostrar la imagen seleccionada en el perfil del usuario (opcional)
                    document.getElementById("avatar").src = event.target.result;
                }
                reader.readAsDataURL(archivo);

                // Crear un FormData para enviar la imagen
                const formData = new FormData();
                formData.append('foto', archivo);
                console.log(archivo);

                // Realizar la solicitud POST para cambiar el avatar
                const response = await fetch('/usuarios/usuario/cambiarAvatar', {
                    method: 'POST',
                    body: formData, // Se envía el FormData con el archivo
                });

                // Procesar la respuesta del servidor
                const data = await response.json();

                if (response.ok) {
                    alert("Foto de perfil actualizada exitosamente.");
                    console.log("URL de la nueva foto:", data.url);
                    // Opcional: Actualizar la imagen del avatar en la interfaz de usuario
                    document.getElementById("avatar").src = data.url;
                } else {
                    alert("Error al cambiar la foto de perfil: " + data.message);
                }
            } catch (error) {
                console.error('Error al intentar cambiar la foto de perfil:', error);
                alert("Hubo un error al cambiar la foto de perfil.");
            }
        }
    }
});