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
    console.log(data)
    data.sort((a, b) => {
        if (a.name.common < b.name.common) return -1;
        if (a.name.common > b.name.common) return 1;
        return 0;
    });
    let elementos = ``
    data.forEach(item => {
        if (item.name.common !== null && item.name.common !== undefined) {
            elementos += `
            <a class="opcionentradatexto d-flex align-items-center justify-content-start dropdown-item ms-1 me-1" id="pais">
                <img src="${item.flags.svg}" alt="${item.flags.alt}" class="bandera me-4">
                <p class="flex-wrap">${item.name.common}</p>
            </a>
        `;
        }
    });
    paises.innerHTML = elementos
}

const buscarPaises = data => {
    formulario.addEventListener('keyup', e => {
        e.preventDefault()
        const letra = formulario.value.toLowerCase()
        const arrayFiltrado = data.filter(item => {
            const letraApi = item.name.common ? item.name.common.toLowerCase() : '';
            return letraApi.includes(letra);
        });
        const listaOrdenada = arrayFiltrado.sort((a, b) => {
            if (a.name.common < b.name.common) return -1;
            if (a.name.common > b.name.common) return 1;
            return 0;
        });
        listaPaises(listaOrdenada);
    })
}