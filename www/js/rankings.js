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
                title: "No estás logueado",
                text: "¡Tienes que loguearte para poder acceder a las puntuaciones!",
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
        });
    }

    async function cargarPuntuaciones() {
        try {
            const resp = await fetch(`/puntuaciones`);
            if (!resp.ok) {
                throw new Error("Error al cargar");
            }
            const datosPuntuacion = await resp.json();
            console.log(datosPuntuacion);
            outputRankingGlobal.innerHTML = crearPuntuacionesGlobales({jugadores: datosPuntuacion});

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página"
            });
        }

        try {
            const respUsuario = await fetch('/usuarios/usuario');
            if (respUsuario.status !== 200) {
                throw new Error("Error al cargar");
            }
            let usuario = await respUsuario.json();
            let pais = usuario.nacionalidad;
            const resp = await fetch(`/puntuaciones/pais/${pais}`);
            if (resp.status !== 200) {
                throw new Error("Error al cargar");
            }
            const datosPuntuacion = await resp.json();
            outputRankingPorPais.innerHTML = crearPuntuacionesPorPais({jugadores: datosPuntuacion});
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página"
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
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página"
            });
        }
    }
});
