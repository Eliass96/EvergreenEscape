document.addEventListener('DOMContentLoaded', async function () {
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.location = '/';
        }
    });

    let outputBattlePass = document.getElementById('outputBattlePass')


    async function cargarPaseDeBatalla() {
        try {
            let datosUsuario;

            let resp = await fetch('/usuarios/usuario', {
                credentials: 'include'
            });
            console.log(resp);
            if (resp.ok) {
                datosUsuario = await resp.json();
                console.log(datosUsuario);
                let experiencia = datosUsuario.experiencia;
                let experienciaMax = 10000;
                const recompensas = [
                    {nombre: 'Monedas', tipo: 'monedas', cantidad: 100},
                    {nombre: 'Super Salto', tipo: 'superSalto', cantidad: 3},
                    {nombre: 'Puntos Extra', tipo: 'puntuacionExtra', cantidad: 5},
                    {nombre: 'Inmunidad', tipo: 'inmunidad', cantidad: 4},
                    {nombre: 'Revivir ', tipo: 'revivir', cantidad: 1},
                ];
                console.log(recompensas);
                outputBattlePass.innerHTML = battlePass({
                    experiencia,
                    experienciaMax,
                    recompensas,
                });
            }

            document.querySelectorAll('.btn-reclamar-recompensa').forEach((btn, index) => {
                btn.addEventListener('click', async () => {
                    const recompensa = recompensas[index];
                    console.log(recompensa);

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

    cargarPaseDeBatalla()

});
