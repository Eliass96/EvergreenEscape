document.addEventListener('DOMContentLoaded', function () {
    let dropdownMenuButton = document.getElementById('dropdownMenuButton');
    window.dropdownMenuButton = dropdownMenuButton;

    $(document).ready(function () {
        // Agrega un controlador de eventos al botón
        $('#dropdownMenuButton').on('click', function () {
            $('.dropdown-menu').toggleClass('show');
        });

        // Cierra el menú desplegable cuando se hace clic fuera de él
        $(document).on('click', function (e) {
            if (!$(e.target).closest('.dropdown').length) {
                $('.dropdown-menu').removeClass('show');
            } else if ($(e.target).closest('.opcionentradatexto').length) {
                $('.dropdown-menu').removeClass('show');

                dropdownMenuButton.textContent = e.target.closest('a').textContent.trim();
                document.getElementById('txtFaltanDatosNacionalidad').style.visibility = 'hidden';
                dropdownMenuButton.classList.remove('error');
                $('.cajaentradatexto').each(function () {
                    let $this = $(this);
                    if (!$this.hasClass('d-flex')) {
                        $this.addClass('d-flex');
                    }
                    if (!$this.hasClass('align-items-center')) {
                        $this.addClass('align-items-center');
                    }
                    if (!$this.hasClass('justify-content-between')) {
                        $this.addClass('justify-content-between');
                    }
                    if (!$this.hasClass('ps-3')) {
                        $this.addClass('ps-3');
                    }
                    $this.removeClass('text-end');
                });
            }
        });
    });

    window.getSelectedNacionalidad = function () {
        return dropdownMenuButton.textContent.trim();
    };
})