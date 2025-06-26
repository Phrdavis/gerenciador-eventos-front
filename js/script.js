function limitarTexto(texto, limite = 1) {
    if (typeof texto !== 'string') return '';
    return texto.length > limite ? texto.slice(0, limite) + '...' : texto;
}

function formatarData(dataISO) {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

function aplicarFiltroTabela(idInput, idTabela) {
    $(`#${idInput}`).on("keyup", function () {
        const valorBusca = $(this).val().toLowerCase();
        $(`#${idTabela} tbody tr`).filter(function () {
            $(this).toggle($(this).text().toLowerCase().includes(valorBusca));
        });
    });
}

function appendAlert(message, type) {
    const alertPlaceholder = document.getElementById('alert')
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}

function formatarTelefone(numero) {
    
    const digitos = numero.replace(/\D/g, '');

    if (digitos.length === 11) {
        return digitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (digitos.length === 10) {
        return digitos.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        
        return digitos;
    }
}

function actionsMenuDrop(element, options){

    var menu = document.createElement('div');
    menu.className = 'dropdown';

    var button = document.createElement('button');
    button.className = 'btn btn-primary dropdown-toggle';
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'dropdown');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = 'Ações';
    menu.appendChild(button);

    var ul = document.createElement('ul');
    ul.className = 'menu-actions dropdown-menu';
    options.forEach(option => {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'item-action dropdown-item';
        a.href = '#';
        a.innerHTML = `<i class="icon-action ${option.icon}"></i> ${option.label}`;
        a.addEventListener('click', option.action);
        li.appendChild(a);
        ul.appendChild(li);
    });
    menu.appendChild(ul);

    element.appendChild(menu);

}
