document.addEventListener('DOMContentLoaded', async function () {
    let fondo;

    botonFondoClaro= document.getElementById('botonFondoClaro');
    botonFondoOscuro= document.getElementById('botonFondoOscuro');

    const respUsuario = await fetch('/usuarios/usuario');
    if (respUsuario.status !== 200) {
        throw new Error("Error al cargar");
    }
    let usuario = await respUsuario.json();
    fondo= usuario.fondoClaro;
    console.log(fondo);

    botonFondoClaro.addEventListener('click', function () {
        fondo= true;
        guardarFondo();
        console.log(fondo);
    })

    botonFondoOscuro.addEventListener('click', function () {
        fondo= false;
        guardarFondo();
        console.log(fondo);
    })

    async function guardarFondo() {
        const data = {
            fondoJuego: fondo
        };
        console.log(data);
        const response = await fetch('/usuarios/partida/usuario', {
            credentials: 'include',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }



});