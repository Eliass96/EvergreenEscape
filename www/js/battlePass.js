document.addEventListener('DOMContentLoaded', async function () {
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.location = '/';
        }
    });

    let outputBattlePass = document.getElementById('outputBattlePass')

    let datosUsuario;
    let urlUsuario = '/usuarios/usuario';
    let resp = await fetch(urlUsuario);
    if (resp.ok) {
        datosUsuario = await resp.json();
        console.log(datosUsuario);
        await cargarPaseDeBatalla();
    }

    async function cargarPaseDeBatalla() {
        try {
            let experiencia = 10000;
            let experienciaMax = 10000;
            const recompensas = [
                {
                    nombre: 'Monedas',
                    tipo: 'monedas',
                    cantidad: 100,
                    imagen: '/img/shopItems/monedaShop.webp',
                    disponible: (experiencia >= 1000),
                    reclamada: (datosUsuario.recompensa.includes("Monedas"))
                },
                {
                    nombre: 'Super Salto',
                    tipo: 'superSalto',
                    cantidad: 3,
                    imagen: '/img/shopItems/supersalto.webp',
                    disponible: (experiencia >= 2500),
                    reclamada: (datosUsuario.recompensa.includes("Super Salto"))
                },
                {
                    nombre: 'Puntos Extra',
                    tipo: 'puntuacionExtra',
                    cantidad: 5,
                    imagen: '/img/shopItems/x2.png',
                    disponible: (experiencia >= 5000),
                    reclamada: (datosUsuario.recompensa.includes("Puntos Extra"))
                },
                {
                    nombre: 'Inmunidad',
                    tipo: 'inmunidad',
                    cantidad: 4,
                    imagen: '/img/shopItems/antiobstaculos.png',
                    disponible: (experiencia >= 7500),
                    reclamada: (datosUsuario.recompensa.includes("Inmunidad"))
                },
                {
                    nombre: 'Revivir',
                    tipo: 'revivir',
                    cantidad: 1,
                    imagen: '/img/shopItems/revivir.png',
                    disponible: (experiencia >= 10000),
                    reclamada: (datosUsuario.recompensa.includes("Revivir"))
                },
            ];

            outputBattlePass.innerHTML = battlePass({
                experiencia,
                experienciaMax,
                recompensas,
            });

            // IMPORTANTE: solo después de renderizar el HTML
            document.querySelectorAll('.boton_reclamar').forEach((btn, index) => {
                btn.addEventListener('click', async () => {
                    const recompensa = recompensas[index];
                    try {
                        const res = await fetch('/reclamar-recompensa', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                userId: datosUsuario._id,
                                recompensaNombre: recompensa.nombre,
                                recompensaTipo: recompensa.tipo,
                                cantidad: recompensa.cantidad
                            })
                        });

                        const result = await res.json();
                        if (result.success) {
                            Swal.fire({
                                icon: "success",
                                title: "¡Recompensa reclamada!",
                                text: result.message,
                                showConfirmButton: false,
                                timer: 1500,
                                timerProgressBar: true
                            }).then( () => {
                                window.location.reload();
                            });
                        } else {
                            Swal.fire({
                                icon: "info",
                                title: "¡Atención!",
                                text: result.message,
                                showConfirmButton: false,
                                timer: 1500,
                                timerProgressBar: true
                            });
                        }
                    } catch (error) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: 'No se pudo reclamar la recompensa',
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true
                        });
                    }
                });
            });
        } catch
            (error) {
            Swal.fire({
                icon: "warning",
                title: "No has iniciado sesión",
                text: "¡Tienes que iniciar sesión para acceder al pase de batalla!",
                confirmButtonText: "Iniciar sesión"
            }).then(() => {
                window.location.href = "/login";
            });
        }
    }
});
