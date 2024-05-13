document.addEventListener('DOMContentLoaded', async function () {
    const elementosA = document.querySelectorAll('a');

    if (document.getElementById('butUser')) {
        try {

            let resp = await fetch('/usuarios/estado', {
                credentials: 'include',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!resp.ok) {
                console.log(resp)
                document.getElementById('butUser').setAttribute('href', '../html/login.html');
                elementosA.forEach(elemento => {
                    elemento.style.visibility = 'hidden';
                });
                document.getElementById('butUser').style.visibility = 'visible';
                document.getElementById('txtNotLogged').style.visibility = 'visible';
            } else {
                const data = await resp.json();
                console.log(data)
                if (data.usuarioId) {
                    console.log(data.usuarioId)
                    document.getElementById('butUser').setAttribute('href', '../html/profile.html');
                    elementosA.forEach(elemento => {
                        elemento.style.visibility = 'visible';
                    });
                    document.getElementById('txtNotLogged').style.visibility = 'hidden';
                } else {
                    document.getElementById('butUser').setAttribute('href', '../html/login.html');
                    elementosA.forEach(elemento => {
                        elemento.style.visibility = 'hidden';
                    });
                    document.getElementById('butUser').style.visibility = 'visible';
                    document.getElementById('txtNotLogged').style.visibility = 'visible';
                }
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página"
            });
        }
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
