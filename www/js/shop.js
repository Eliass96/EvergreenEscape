let monedasTotales;
let usuario;
document.addEventListener('DOMContentLoaded', async function () {
    await cantidadMonedas();

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
                text: "Algo ha fallado, pruebe a reiniciar la página"
            });
        }
    }

    const comprarItem = async (itemComprado, cantidadComprada) => {
        const url = '/usuarios/items/usuario';
        const data = {itemComprado, cantidadComprada};

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
                    text: "Algo ha fallado, pruebe a reiniciar la página"
                });
            } else {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Compra realizada!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                })
                await cantidadMonedas();
            }
            return await response.json();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página"
            });
        }
    };


    if (document.getElementById('btnComprarSalto')) {
        let btnComprarSalto = document.getElementById('btnComprarSalto');
        btnComprarSalto.addEventListener('click', function () {
            confirmarCompraSalto();

        });
    }

    if (document.getElementById('btnComprarPuntuacionDoble')) {
        let btnComprarPuntuacionDoble = document.getElementById('btnComprarPuntuacionDoble');
        btnComprarPuntuacionDoble.addEventListener('click', function () {
            confirmarCompraPuntuacionDoble();

        });
    }

    if (document.getElementById('btnComprarInmunidad')) {
        let btnComprarSalto = document.getElementById('btnComprarInmunidad');
        btnComprarSalto.addEventListener('click', function () {
            confirmarCompraInmunidad();

        });
    }

    if (document.getElementById('btnComprarRevivir')) {
        let btnComprarRevivir = document.getElementById('btnComprarRevivir');
        btnComprarRevivir.addEventListener('click', function () {
            confirmarCompraRevivir();

        });
    }

    function confirmarCompraSalto() {
        Swal.fire({
            title: "¿Cuántos saltos quieres comprar?",
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
                    comprarItem(1, result.value)
                }
            }
        });
    }

    function confirmarCompraPuntuacionDoble() {
        Swal.fire({
            title: "¿Cuántos objetos de puntuación doble quieres comprar?",
            input: "number",
            inputValue: 1,
            animation: true,
            confirmButtonColor: "lightgreen",
            inputAttributes: {
                min: 1
            },
            showCancelButton: true,
            confirmButtonText: "Comprar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value * 30 > monedasTotales) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No tienes suficientes monedas"
                    });
                } else {
                    comprarItem(2, result.value)
                }
            }
        });
    }

    function confirmarCompraInmunidad() {
        Swal.fire({
            title: "¿Cuántos escudos quieres comprar?",
            input: "number",
            inputValue: 1,
            animation: true,
            confirmButtonColor: "lightgreen",
            inputAttributes: {
                min: 1
            },
            showCancelButton: true,
            confirmButtonText: "Comprar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value * 40 > monedasTotales) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No tienes suficientes monedas"
                    });
                } else {
                    comprarItem( 3, result.value)
                }
            }
        });
    }

    function confirmarCompraRevivir() {
        Swal.fire({
            title: "¿Cuántas vidas quieres comprar?",
            input: "number",
            inputValue: 1,
            animation: true,
            confirmButtonColor: "lightgreen",
            inputAttributes: {
                min: 1
            },
            showCancelButton: true,
            confirmButtonText: "Comprar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value * 50 > monedasTotales) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No tienes suficientes monedas"
                    });
                } else {
                    comprarItem(4, result.value)
                }
            }
        });
    }
});
