const paises = document.getElementById('listadoPaises');
let formulario;
let data;
let dataTraducido;
document.addEventListener('DOMContentLoaded', async () => {
    await fetchData();
    formulario = document.getElementById('formularioPaises');
    formulario.addEventListener('input', () => {
        buscarPaises(data, dataTraducido);
    })
})

const fetchData = async () => {
    try {
        const response = await fetch('../apiPaises.json');
        const responseTrad = await fetch('../apiPaisesTraducida.json');
        data = await response.json();
        dataTraducido = await responseTrad.json();
        listaPaises(data, dataTraducido);
    } catch (error) {
        console.log(error);
    }
}

const listaPaises = (data, dataTraducido) => {
    dataTraducido.sort((a, b) => {
        if (a.translations.es < b.translations.es) return -1;
        if (a.translations.es > b.translations.es) return 1;
        return 0;
    });
    let elementos = ``
    dataTraducido.forEach(itemEsp => {
        if (itemEsp.translations.es !== null && itemEsp.translations.es !== undefined) {
            data.forEach(item => {
                if (item.name.common !== null && item.name.common !== undefined) {
                    if (item.name.common === itemEsp.name) {
                        elementos += `
                            <a class="opcionentradatexto d-flex align-items-center justify-content-start dropdown-item ms-1 me-1" id="pais">
                                <img src="${item.flags.svg}" alt="${item.flags.alt}" class="bandera me-4">
                                <p class="flex-wrap">${itemEsp.translations.es}</p>
                            </a>
                        `;
                    }
                }
            });
        }
    });
    paises.innerHTML = elementos
}

const buscarPaises = (data, dataTraducido) => {
    formulario.addEventListener('keyup', e => {
        e.preventDefault()
        const letra = formulario.value.toLowerCase()
        const arrayFiltrado = dataTraducido.filter(item => {
            const letraApi = item.translations.es ? item.translations.es.toLowerCase() : '';
            return letraApi.includes(letra);
        });
        const listaOrdenada = arrayFiltrado.sort((a, b) => {
            if (a.translations.es < b.translations.es) return -1;
            if (a.translations.es > b.translations.es) return 1;
            return 0;
        });
        let elementos = ``
        listaOrdenada.forEach(itemEsp => {
            if (itemEsp.translations.es !== null && itemEsp.translations.es !== undefined) {
                data.forEach(item => {
                    if (item.name.common !== null && item.name.common !== undefined) {
                        if (item.name.common === itemEsp.name) {
                            elementos += `
                                <a class="opcionentradatexto d-flex align-items-center justify-content-start dropdown-item ms-1 me-1" id="pais">
                                    <img src="${item.flags.svg}" alt="${item.flags.alt}" class="bandera me-4">
                                    <p class="flex-wrap">${itemEsp.translations.es}</p>
                                </a>
                            `;
                        }
                    }
                });
            }
        });
        paises.innerHTML = elementos
    })
}