document.addEventListener("DOMContentLoaded", async function () {
    let outputRanking = document.getElementById("rankingPersonal");
    let outputRankingGlobal = document.getElementById("rankingGlobal");
    let outputRankingPorPais = document.getElementById("rankingPorPais");

    try {
        let urlUsuario = '/usuarios/usuario';
        let resp = await fetch(urlUsuario);
        if (resp.ok) {
            await cargarPuntuaciones();
        } else {
            Swal.fire({
                icon: "warning",
                title: "No has iniciado sesión",
                text: "¡Tienes que iniciar sesión para poder acceder a las puntuaciones!",
                confirmButtonText: "Aceptar"
            }).then(() => {
                document.location.href = "../html/login.html";
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "Error inesperado al cargar las puntuaciones... Pruebe a reiniciar la página",
        }).then(() => {
            document.location.href = "/"
        });
    }

    async function cargarPuntuaciones() {
        try {
            const resp = await fetch(`/usuarios/puntuaciones`);
            if (!resp.ok) {
                throw new Error("Error al cargar");
            }
            const datosPuntuacion = await resp.json();
            outputRankingGlobal.innerHTML = crearPuntuacionesGlobales({jugadores: datosPuntuacion});

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página"
            }).then(() => {
                document.location.href = "/"
            });
        }

        try {
            const respUsuario = await fetch('/usuarios/usuario');
            if (respUsuario.status !== 200) {
                throw new Error("Error al cargar");
            }
            let usuario = await respUsuario.json();
            let nacionalidad = usuario.nacionalidad;
            const resp = await fetch(`/usuarios/puntuaciones/${nacionalidad}`);
            if (resp.status !== 200) {
                throw new Error("Error al cargar");
            }
            const datosPuntuacion = await resp.json();
            outputRankingPorPais.innerHTML = crearPuntuacionesPorPais({jugadores: datosPuntuacion});
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página"
            }).then(() => {
                document.location.href = "/"
            });
        }

        try {
            const resp = await fetch('/usuarios/usuario/puntuaciones');
            if (!resp.ok) {
                throw new Error("Error al cargar");
            }
            const datosPuntuacion = await resp.json();
            outputRanking.innerHTML = crearPuntuaciones({puntuaciones: datosPuntuacion});
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página"
            }).then(() => {
                document.location.href = "/"
            });
        }
    }
});
