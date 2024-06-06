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
                document.getElementById('butUser').setAttribute('href', '../html/login.html');
                elementosA.forEach(elemento => {
                    elemento.style.visibility = 'hidden';
                });
                document.getElementById('butUser').style.visibility = 'visible';
                document.getElementById('txtNotLogged').style.visibility = 'visible';
            } else {
                const data = await resp.json();
                if (data.usuarioId) {
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
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo ha fallado, pruebe a reiniciar la página"
            });
        }
    }
});
