document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('loginButton')) {
        document.getElementById('loginButton').addEventListener('click', formularioLogin);
        document.getElementById('checkboxLogin').addEventListener('click', verpasswordLogin);
        console.log(localStorage.getItem('isLogged'))

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
                const resp = await fetch("/usuarios/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
                if (!resp.ok) {
                    window.isLogged = null;
                    localStorage.setItem('isLogged', window.isLogged);
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "¡Error al iniciar sesión!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                    })
                } else {
                    let respJson = await resp.json();
                    console.log(respJson.usuario._id);
                    window.isLogged = respJson.usuario._id;
                    localStorage.setItem('isLogged', window.isLogged);
                    console.log(localStorage.getItem('isLogged'))
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "¡Has iniciado sesión!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                    }).then(() => {
                        //document.location.href = "/"
                    })
                }
            }
        }
    }
});