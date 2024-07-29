let partnersData = [];

function checkNull(value) {
    return value ? value : "-----";
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function toCamelCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function consultarCNPJ() {
    const cnpj = document.getElementById('cnpj-input').value.replace(/[^\d]+/g, '');
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);

    try {
        if (!response.ok) {
            throw new Error('Erro ao buscar dados da empresa. Verifique o CNPJ e tente novamente.');
        } else {
            const data = await response.json();

            document.getElementById('body').classList.remove('overflow');
            document.getElementById('image-area').classList.add('d-none');
            setData(data);
        }
    } catch (error) {
        alert(error.message);
    }
}

function setData(data) {
    document.getElementById('company-info').classList.remove('d-none');
    
    document.getElementById('name').value = checkNull(data.nome_fantasia);
    document.getElementById('social-reason').value = checkNull(data.razao_social);
    document.getElementById('opening-date').value = checkNull(data.data_abertura);
    document.getElementById('status').value = checkNull(data.situacao);
    document.getElementById('main-activity').value = checkNull(data.cnae_fiscal_descricao);
    document.getElementById('address').value = checkNull(`${data.logradouro}, ${data.numero}, ${data.bairro}, ${data.municipio} - ${data.uf}, ${data.cep}`);
    document.getElementById('phone').value = checkNull(data.ddd_telefone_1);
    document.getElementById('email').value = checkNull(data.email);

    savePartners(data);
}

function savePartners(data) {
    partnersData = data.qsa;
    createTable(partnersData, false);
}

function createTable(data, filter) {
    const partnersInfo = document.getElementById('partners-info');
    partnersInfo.innerHTML = '';
    let id = 1;

    if(data.length > 0 || filter) {
        document.getElementById('partners-info-area').classList.remove('d-none');
        document.getElementById('no-partners-area').classList.add('d-none');

        data.forEach(partner => {
            const partnerRow = document.createElement('tr');
            partnerRow.innerHTML = `
                <td class='table-id'>${id}</td>
                <td class='table-text'>${toCamelCase(checkNull(partner.nome_socio))}</td>
                <td class='table-text'>${checkNull(partner.qualificacao_socio)}</td>
                <td class='table-text'>${checkNull(formatDate(partner.data_entrada_sociedade))}</td>
            `;
            partnersInfo.appendChild(partnerRow);
            id++;
        });
    } else {
        document.getElementById('no-partners-area').classList.remove('d-none');
        document.getElementById('partners-info-area').classList.add('d-none');
    }
}

function filterPartners() {
    const filterValue = document.getElementById('filter-input').value.toLowerCase();
    const filteredData = partnersData.filter(partner => 
        partner.nome_socio.toLowerCase().includes(filterValue)
    );
    createTable(filteredData, true);
}

document.getElementById('filter-input').addEventListener('input', filterPartners);

function clear() {
    document.getElementById('cnpj-input').value = '';
    document.getElementById('image-area').classList.remove('d-none');
    document.getElementById('company-info').classList.add('d-none');
    document.getElementById('no-partners-area').classList.add('d-none');
    document.getElementById('partners-info-area').classList.add('d-none');
}

document.getElementById('btn-close').addEventListener('click', clear);

function salvarDados(event) {
    // o endpoint não recebe update então farei uma simulação simples na tela
    event.preventDefault();
    alert('Suas alterações foram salvas :)');
    clear();
}