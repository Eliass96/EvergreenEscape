document.addEventListener('DOMContentLoaded', function () {

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
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Compra realizada!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                })
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
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Compra realizada!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                })
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
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Compra realizada!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                })
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
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Compra realizada!",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                })
            }
        });
    }
});
