async function cargarPuntuaciones(filtro = undefined) {
    let resp;
    let url;
    if (filtro) {
        url = '/usuarios/puntuaciones/:id';
    } else {
        url="/puntuaciones/pais/:id";
        url = '/puntuaciones';
    }
    try {
        resp = await fetch(url);
        if (!resp.ok) {
            throw new Error("Error al cargar");
        }
        const datosRutinas = await resp.json();
        const html = crearRutinas({ rutinas: datosRutinas });
        output.innerHTML = html;
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo ha fallado, pruebe a reiniciar la página"
        });
    }
}