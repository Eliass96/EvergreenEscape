let monedasTotales;
let usuario;

document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        window.location = '../index.html';
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    await cargarUsuario();
    let outputSuperSalto = document.getElementById("outputSuperSalto");
    let outputPuntuacionDoble = document.getElementById("outputPuntuacionDoble");
    let outputInmunidad = document.getElementById("outputInmunidad");
    let outputRevivir = document.getElementById("outputRevivir");
    await cargarObjetos();
    outputSuperSalto.addEventListener("click", confirmarCompraObjeto);
    outputPuntuacionDoble.addEventListener("click", confirmarCompraObjeto);
    outputInmunidad.addEventListener("click", confirmarCompraObjeto);
    outputRevivir.addEventListener("click", confirmarCompraObjeto);

    async function cargarUsuario() {
        try {
            let urlUsuario = '/usuarios/usuario';
            let resp = await fetch(urlUsuario);
            if (resp.ok) {
                await cantidadMonedas();
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "No has iniciado sesión",
                    text: "¡Tienes que iniciar sesión para poder acceder a la tienda!",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    document.location.href = "../html/login.html";
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ups...",
                text: "Error inesperado al cargar la tienda... Pruebe a reiniciar la página",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            }).then(() => {
                document.location.href = "/"
            });
        }
    }

    async function cargarObjetos() {
        try {
            let urlObjeto;
            urlObjeto = `/tienda/objeto/superSalto`;
            const respSalto = await fetch(urlObjeto);
            if (respSalto.ok) {
                let datosObjeto = await respSalto.json();
                outputSuperSalto.innerHTML = superSalto(datosObjeto);
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "No se puede cargar el objeto",
                    text: "¡Error al cargar el objeto de super salto! Pruebe a reiniciar la página",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                }).then(() => {
                    document.location.href = "/"
                });
            }

            urlObjeto = `/tienda/objeto/puntuacionX2`;
            const respPuntuacion = await fetch(urlObjeto);
            if (respPuntuacion.ok) {
                let datosObjeto = await respPuntuacion.json();
                outputPuntuacionDoble.innerHTML = puntuacionDoble(datosObjeto);
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "No se puede cargar el objeto",
                    text: "¡Error al cargar el objeto de puntuación doble! Pruebe a reiniciar la página",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    document.location.href = "/"
                });
            }

            urlObjeto = `/tienda/objeto/inmunidad`;
            const respInmunidad = await fetch(urlObjeto);
            if (respInmunidad.ok) {
                let datosObjeto = await respInmunidad.json();
                outputInmunidad.innerHTML = inmunidad(datosObjeto);
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "No se puede cargar el objeto",
                    text: "¡Error al cargar el objeto de inmunidad! Pruebe a reiniciar la página",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    document.location.href = "/"
                });
            }

            urlObjeto = `/tienda/objeto/revivir`;
            const respRevivir = await fetch(urlObjeto);
            if (respRevivir.ok) {
                let datosObjeto = await respRevivir.json();
                outputRevivir.innerHTML = revivir(datosObjeto);
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "No se puede cargar el objeto",
                    text: "¡Error al cargar el objeto de revivir! Pruebe a reiniciar la página",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true

                }).then(() => {
                    document.location.href = "/"
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ups...",
                text: "¡Error al cargar el objeto de super salto! Pruebe a reiniciar la página",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                document.location.href = "/"
            });
        }
    }

    async function cantidadMonedas() {
        try {
            const respUsuario = await fetch('/usuarios/usuario');
            if (respUsuario.status !== 200) {
                throw new Error("Error al cargar");
            }
            let usuario = await respUsuario.json();
            monedasTotales = usuario.monedas;

            document.getElementById("cantidadMonedas").textContent = monedasTotales.toString();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                document.location.href = "/"
            });
        }
    }

    const comprarItem = async (objetoId, cantidadComprada) => {
        const url = '/usuarios/usuario/items';
        const data = {objetoId, cantidadComprada};

        try {
            const response = await fetch(url, {
                credentials: 'include',
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error en la compra, pruebe a reiniciar la página",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                }).then(() => {
                    document.location.href = "/"
                });
            } else {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Compra realizada!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true
                })
                await cantidadMonedas();
            }
            return await response.json();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                document.location.href = "/"
            });
        }
    };

    async function confirmarCompraObjeto(evt) {
        if (evt.target.classList.contains("btnComprar")) {
            const item = evt.target.closest(".cardShop");
            let id = item.dataset.idObjeto;
            Swal.fire({
                title: "¿Cuántos objetos quieres comprar?",
                input: "number",
                inputValue: 1,
                inputAttributes: {
                    min: 1
                },
                animation: true,
                confirmButtonColor: "lightgreen",
                showCancelButton: true,
                confirmButtonText: "Comprar",
                cancelButtonText: "Cancelar",
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    if (result.value * 20 > monedasTotales) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "No tienes suficientes monedas"
                        });
                    } else {
                        comprarItem(id, result.value)
                    }
                }
            });
        }
    }
});
