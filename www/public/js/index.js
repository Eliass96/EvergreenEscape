document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('but_cancelar_ajustes')) {
        let but_cancelar_ajustes = document.getElementById('but_cancelar_ajustes');
        but_cancelar_ajustes.addEventListener('click', function () {
            cancelarAjustes();
        });
    }

    if (document.getElementById('butUser')) {
        console.log(localStorage.getItem('isLogged'))
        if (localStorage.getItem('isLogged') === 'true') {
            document.getElementById('butUser').setAttribute('href', '../html/profile.html');
        } else {
            document.getElementById('butUser').setAttribute('href', '../html/login.html');
        }
    }

    if (document.getElementById('but_aceptar_ajustes')) {
        let but_aceptar_ajustes = document.getElementById('but_aceptar_ajustes');
        but_aceptar_ajustes.addEventListener('click', function () {
            confirmarAjustes();
        });
    }

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

    function confirmarAjustes() {
        Swal.fire({
            title: "¿Quieres guardar los ajustes?",
            icon: "question",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            denyButtonText: "Salir sin guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "lightgreen",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */

            if (result.isConfirmed) {

                window.location.href = "../index.html";

            } else if (result.isDenied) {
                window.location.href = "../index.html";
            }

        });
    }

    function cancelarAjustes() {
        Swal.fire({
            title: "¿Quieres salir sin guardar los ajustes?",
            icon: "warning",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            denyButtonText: "Salir sin guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "lightgreen",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */

            if (result.isConfirmed) {

                window.location.href = "../index.html";

            } else if (result.isDenied) {
                window.location.href = "../index.html";
            }

        });
    }
});
