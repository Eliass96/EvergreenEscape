document.addEventListener("DOMContentLoaded", function () {
    div = document.getElementById("rankingPersonal");
    cargarPuntuaciones();

    async function cargarPuntuaciones() {
        try {
            const item = evt.target.closest(".texto_ranking");
            const id = item.getAttribute("id");
            const resp = await fetch(`/usuarios/${id}`);
            if (!resp.ok) {
                throw new Error("Error al cargar");
            }
            const datosPuntuacion = await resp.json();
            const html = crearPuntuaciones(datosPuntuacion);
            div.innerHTML = html;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página"
            });
        }
    }
});