document.addEventListener("DOMContentLoaded", async function () {
    let outputRanking = document.getElementById("rankingPersonal");
    let outputRankingGlobal = document.getElementById("rankingGlobal");
    let outputRankingPorPais = document.getElementById("rankingPorPais");

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
});
