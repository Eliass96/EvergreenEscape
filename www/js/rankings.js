document.addEventListener("DOMContentLoaded", async function () {
    let outputRanking = document.getElementById("rankingPersonal");

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
});