document.addEventListener('DOMContentLoaded', function () {
    const elementosA = document.querySelectorAll('a');

    if (document.getElementById('butUser')) {
        fetch('/usuarios/sesion/estado', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.estadoSesion === 'activa') {
                    document.getElementById('butUser').setAttribute('href', '../html/profile.html');
                    elementosA.forEach(elemento => {
                        elemento.style.visibility = 'visible';
                    });
                } else {
                    document.getElementById('butUser').setAttribute('href', '../html/login.html');
                    elementosA.forEach(elemento => {
                        elemento.style.visibility = 'hidden';
                    });
                    document.getElementById('butUser').style.visibility = 'visible';
                }
            })
            .catch(error => console.error(error));
    }

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
