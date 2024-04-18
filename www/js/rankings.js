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
        outputRankingGlobal.innerHTML = crearPuntuacionesGlobales({puntuaciones: datosPuntuacion});
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo ha fallado, pruebe a reiniciar la página"
        });
    }

    try {
        let idUsuario = localStorage.getItem('isLogged');
        const respUsuario = await fetch(`/usuarios/${idUsuario}`);
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
        outputRankingPorPais.innerHTML = crearPuntuacionesPorPais({puntuaciones: datosPuntuacion});
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo ha fallado, pruebe a reiniciar la página"
        });
    }


    try {
        let idUsuario = localStorage.getItem('isLogged');
        const resp = await fetch(`/usuarios/${idUsuario}/puntuaciones`);
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
