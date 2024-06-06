document.addEventListener('DOMContentLoaded', async function () {
    const elementosA = document.querySelectorAll('a');
    elementosA.forEach(elemento => {
        elemento.addEventListener('mouseenter', toggleClase);
        elemento.addEventListener('mouseleave', toggleClase);
    });
    function toggleClase(event) {
        const elemento = event.target;
        if (elemento.classList.contains('animate__slow')) {
            elemento.classList.remove('animate__slow');
            elemento.classList.add('animate__faster');
        } else if (elemento.classList.contains('animate__faster')) {
            elemento.classList.remove('animate__faster');
            elemento.classList.add('animate__slow');
        }
    }
});