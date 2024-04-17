async function cargarPuntuaciones() {
    let resp;
    let url;

    try {
        resp = await fetch(url);
        if (!resp.ok) {
            throw new Error("Error al cargar");
        }
        const datosPuntuacion = await resp.json();
        const html = crearPuntuaciones({ puntuaciones: datosPuntuacion });
        output.innerHTML = html;
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo ha fallado, pruebe a reiniciar la página"
        });
    }
}