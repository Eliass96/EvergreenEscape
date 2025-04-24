document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('outputPerfil').addEventListener('click', accionesPerfil);
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.location = '/';
        }
    });

    let outputPerfil = document.getElementById("outputPerfil");
    let datosUsuario
    try {
        let urlUsuario = '/usuarios/usuario';
        let resp = await fetch(urlUsuario);
        if (resp.ok) {
            datosUsuario = await resp.json();
            console.log(datosUsuario);
            outputPerfil.innerHTML = crearPerfil(datosUsuario);
            // Convierte el array binario a un Buffer
            // const buffer = Buffer.from(datosUsuario.avatar.binario.data);
            // const base64String = buffer.toString('base64');
            //
            // // Si el binario existe, lo usamos para mostrar la imagen
            // if (base64String) {
            //     console.log(base64String)
            //     // Asignar la imagen a la etiqueta <img>
            //     document.getElementById('avatar').src = `data:image/png;base64,${base64String}`;
            // } else {
            //     console.log('No se encontró la imagen en binario.');
            // }

            let cropper;
            const avatar = document.getElementById('avatar');
            const input = document.getElementById('avatarInput');
            const cropperImage = document.getElementById('cropperImage');
            const cropperModal = new bootstrap.Modal(document.getElementById('cropperModal'));

            avatar.addEventListener('click', () => input.click());
            let file = null;
            input.addEventListener('change', (e) => {
                file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    cropperImage.src = reader.result;
                    cropperModal.show();

                    setTimeout(() => {
                        if (cropper) cropper.destroy();  // Destruir la instancia anterior
                        cropper = new Cropper(cropperImage, {
                            aspectRatio: 1,
                            viewMode: 1,
                        });
                    }, 300);
                };
                reader.readAsDataURL(file);
            });

            document.getElementById('cropImageBtn').addEventListener('click', async () => {
                if (cropper) {
                    // Obtener el canvas recortado
                    const canvas = cropper.getCroppedCanvas({
                        width: 300,
                        height: 300,
                    });

                    canvas.toBlob(async (blob) => {
                        // Aquí tienes el archivo binario (un Blob)
                        const fileRecortado = new File([blob], 'avatar.png', {type: 'image/png'});

                        // Muestra la imagen recortada
                        avatar.src = URL.createObjectURL(fileRecortado);

                        // Enviar el archivo binario al backend
                        await enviarFotoPerfil(fileRecortado);
                    }, 'image/png');
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
            // document.location.href = "/"
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
        }
    }

    function arrayBufferToBase64(buffer) {
        // Crear un array de bytes desde el ArrayBuffer
        const uint8Array = new Uint8Array(buffer);

        // Convertir el array de bytes a una cadena binaria
        let binary = '';
        uint8Array.forEach(byte => {
            binary += String.fromCharCode(byte);
        });

        // Codificar la cadena binaria en base64
        return 'data:image/jpeg;base64,' + btoa(binary);
    }

    // Función que maneja la solicitud de la API después de que se haya cerrado el cropper
    async function enviarFotoPerfil(file) {
        try {
            const formData = new FormData();
            formData.append('foto', file);

            const response = await fetch('/usuarios/usuario/cambiarAvatar', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Foto de perfil actualizada con éxito.",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });

                console.log(data);  // Aquí se verá la respuesta, que contiene la imagen en Base64

                // Asignar la imagen al avatar usando Base64
                document.getElementById('avatar').src = data.fotoBase64;

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al cambiar la foto de perfil.",
                    text: data.message,
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            console.error('Error al intentar cambiar la foto de perfil:', error);
            Swal.fire({
                icon: "error",
                title: "Hubo un error al cambiar la foto de perfil.",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        }
    }


});
