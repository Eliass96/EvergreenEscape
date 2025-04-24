document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('outputPerfil').addEventListener('click', accionesPerfil);
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
                    // Obtiene el canvas con la imagen recortada
                    const canvas = cropper.getCroppedCanvas({
                        width: 300,
                        height: 300,
                    });

                    // Convierte el canvas a base64
                    const base64 = canvas.toDataURL('image/png'); // O usa el formato que prefieras

                    // Muestra la imagen recortada
                    avatar.src = base64;

                    cropperModal.hide();

                    // Enviar la imagen base64 al backend
                    await enviarFotoPerfil(base64);
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
        }
    }

    // Función que maneja la solicitud de la API después de que se haya cerrado el cropper
    async function enviarFotoPerfil(foto) {
        try {
            const dataFoto = {
                foto: foto, // Enviar base64 como un campo en el JSON
            };
            console.log(dataFoto)
            // Realizar la solicitud POST para cambiar el avatar
            const response = await fetch('/usuarios/usuario/cambiarAvatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Asegúrate de especificar que el contenido es JSON
                },
                body: JSON.stringify(dataFoto), // Convierte el objeto en una cadena JSON
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Foto de perfil actualizada con éxito.",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
                console.log("URL de la nueva foto:", data.url);
                // Actualizar la imagen del avatar en la interfaz de usuario
                document.getElementById("avatar").src = data.url;
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

    function convertirImagenABase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extrae solo el base64 sin "data:image..."
            reader.onerror = reject;
            reader.readAsDataURL(file); // Convierte el archivo en base64
        });
    }

    function mostrarImagen(base64) {
        if (!base64) return "https://img.a.transfermarkt.technology/portrait/big/251896-1684241186.jpg?lm=1"; // Imagen por defecto

        return `data:image/png;base64,${base64}`; // Devuelve la URL de la imagen en base64
    }
});
