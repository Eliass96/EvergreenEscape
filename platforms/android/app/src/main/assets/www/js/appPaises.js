const paises = document.getElementById('listadoPaises');
let formulario;
let data;
document.addEventListener('DOMContentLoaded', async () => {
    await fetchData();
    formulario = document.getElementById('formularioPaises');
    formulario.addEventListener('input', () => {
        buscarPaises(data);
    })
})

const fetchData = async () => {
    try {
        const response = await fetch('../api.json');
        data = await response.json();
        listaPaises(data);
    } catch (error) {
        console.log(error);
    }
}

const listaPaises = data => {
    data.sort((a, b) => {
        if (a.translations.es < b.translations.es) return -1;
        if (a.translations.es > b.translations.es) return 1;
        return 0;
    });
    let elementos = ``
    data.forEach(item => {
        if (item.translations.es !== null && item.translations.es !== undefined) {
            elementos += `
                <a class="opcionentradatexto d-flex align-items-center justify-content-center dropdown-item m-1" id="pais">
                    <!--<img src="${item.flag}" alt="" class="bandera">-->
                    <p class="flex-wrap">${item.translations.es}</p>
                </a>
            `
        }
    });
    paises.innerHTML = elementos
}

const buscarPaises = data => {
    formulario.addEventListener('keyup', e => {
        e.preventDefault()
        const letra = formulario.value.toLowerCase()
        const arrayFiltrado = data.filter(item => {
            const letraApi = item.translations && item.translations.es ? item.translations.es.toLowerCase() : '';
            return letraApi.includes(letra);
        });
        const listaOrdenada = arrayFiltrado.sort((a, b) => {
            if (a.translations.es < b.translations.es) return -1;
            if (a.translations.es > b.translations.es) return 1;
            return 0;
        });
        listaPaises(listaOrdenada);
    })
}