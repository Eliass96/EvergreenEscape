document.addEventListener('DOMContentLoaded', async function () {
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.location = '/';
        }
    });

    let outputBattlePass=document.getElementById('outputBattlePass')
    cargarPaseDeBatalla()

    async function cargarPaseDeBatalla() {
        try {
            const resp = await fetch('/usuarios/usuario');
            if (!resp.ok) throw new Error('No autorizado');

            const datosUsuario = await resp.json();

            let experiencia = datosUsuario.experiencia;
            let experienciaMaxima= 10000;

            outputBattlePass.innerHTML = battlePass({
                experiencia,
                experienciaMaxima,
                recompensa,
            });

            document.querySelectorAll('.btn-reclamar-recompensa').forEach((btn, index) => {
                btn.addEventListener('click', async () => {
                    const recompensasDefinidas = [
                        { nombre: 'monedas100', tipo: 'monedas', cantidad: 100 },
                        { nombre: 'superSalto', tipo: 'superSalto', cantidad: 3 },
                        { nombre: 'puntosBonus', tipo: 'puntuacionExtra', cantidad: 5},
                        { nombre: 'inmunidadTotal', tipo: 'inmunidad', cantidad: 4 },
                        { nombre: 'revivir', tipo: 'experiencia', cantidad: 1 },
                    ];

                    const recompensa = recompensasDefinidas[index];

                    try {
                        const res = await fetch('/reclamar-recompensa', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: datosUsuario._id,
                                recompensaNombre: recompensa.nombre,
                                recompensaTipo: recompensa.tipo,
                                cantidad: recompensa.cantidad
                            })
                        });

                        const result = await res.json();
                        if (result.success) {
                            Swal.fire('¡Recompensa reclamada!', result.message, 'success');
                        } else {
                            Swal.fire('Atención', result.message, 'info');
                        }
                    } catch (error) {
                        Swal.fire('Error', 'No se pudo reclamar la recompensa', 'error');
                    }
                });
            });

        } catch (error) {
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
