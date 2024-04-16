document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('butUser')) {
        console.log(localStorage.getItem('isLogged'))
        if (localStorage.getItem('isLogged') === 'true') {
            document.getElementById('butUser').setAttribute('href', '../html/profile.html');
        } else {
            document.getElementById('butUser').setAttribute('href', '../html/login.html');
        }
    }

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
        } else {
            elemento.classList.remove('animate__faster');
            elemento.classList.add('animate__slow');
        }
    }
});
