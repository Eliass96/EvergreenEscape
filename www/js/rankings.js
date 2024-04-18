document.addEventListener("DOMContentLoaded", async function () {
    let outputRanking = document.getElementById("rankingPersonal");
    let outputRankingGlobal = document.getElementById("rankingGlobal");

    try {
        let idUsuario = localStorage.getItem('isLogged');
        const resp = await fetch(`/usuarios/${idUsuario}/puntuaciones`);
        if (!resp.ok) {
            throw new Error("Error al cargar");
        }
        const datosPuntuacion = await resp.json();
        console.log(datosPuntuacion);
        const html = crearPuntuaciones({puntuaciones: datosPuntuacion});
        outputRanking.innerHTML = html;
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo ha fallado, pruebe a reiniciar la página"
        });
    }


    try {
        const resp = await fetch(`/puntuaciones`);
        if (!resp.ok) {
            throw new Error("Error al cargar");
        }
        const datosPuntuacion = await resp.json();
        console.log(datosPuntuacion);
        const html1 = crearPuntuacionesGlobales({puntuaciones: datosPuntuacion});
        outputRankingGlobal.innerHTML = html1;
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo ha fallado, pruebe a reiniciar la página"
        });
    }
});