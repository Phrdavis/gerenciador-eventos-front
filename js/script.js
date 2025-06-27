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
        var button = document.createElement('button');
        button.className = 'item-action dropdown-item';
        if (option.disabled) {
            button.className += ' disabled';
        }
        button.href = '#';
        button.innerHTML = `<i class="icon-action ${option.icon}"></i> ${option.label}`;
        button.addEventListener('click', option.action);
        li.appendChild(button);
        ul.appendChild(li);
    });
    menu.appendChild(ul);

    element.appendChild(menu);

}

function resetMultSelect(element, hiddenElement = null) {

    if(element != null){

        const checkboxes = element.querySelectorAll('.dropdown-mult-select-content input[type="checkbox"]');
        
        // Desmarque todos os checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    
        // Limpar as tags visuais (opções selecionadas)
        const selectedOptionsDiv = element.querySelector('.dropdown-mult-select-button');
        if(selectedOptionsDiv != null){
    
            selectedOptionsDiv.innerHTML = "Selecione as opções"; // Ou qualquer texto inicial
        }
    
        // Limpar o campo oculto (se fornecido)
        if (hiddenElement !== null) {
            const hiddenInput = $(hiddenElement);
            if (hiddenInput) {
                hiddenInput.val('');
            }
        }

    }

}

function criaMultSelect(element, options, hiddenElement = null){

    const limitShowOptions = 3;
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown-mult-select");

    const button = document.createElement("div");
    button.classList.add("dropdown-mult-select-button");
    let textInicial = "Selecione as opções";
    button.textContent = textInicial;
    dropdown.append(button);

    const content = document.createElement("div");
    content.classList.add("dropdown-mult-select-content");
    options.forEach(option => {
        const label = document.createElement("label");
        label.classList.add("mult-select-checkbox");
        label.innerHTML = `<input type="checkbox" data-label="${option.label}" name="${option.value}" value="${option.value}"> ${option.label}`;
        content.append(label);
    });
    dropdown.append(content);


    if(element != null){

        element.innerHTML = '';
        element.appendChild(dropdown);

    }

    // Função para alternar o dropdown
    button.addEventListener("click", function() {
        dropdown.classList.toggle("active");
    });

    // Função para capturar as opções selecionadas
    const checkboxes = dropdown.querySelectorAll('.dropdown-mult-select-content input[type="checkbox"]');
    const selectedOptionsDiv = button;
    const hiddenInput = $(hiddenElement);

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedOptions);
    });

    function createTag(label, close = true) {
        return `<span class="badge bg-primary bg-opacity-25 text-primary rounded-pill p-2 m-1">${label} ${close ? '<i class="tag-mult-close bi bi-x-lg"></i>' : ''}</span>`;
    }

    function updateSelectedOptions() {
        const selectedOptions = [];
        const selectedValues = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedValues.push(checkbox.value);
                var tag = createTag(checkbox.dataset.label);
                selectedOptions.push(tag);
            }
        });

        if (hiddenInput != null) {
            hiddenInput.val(selectedValues.join(','));
            console.log(hiddenInput.val())
        }

        if (selectedOptions.length == 0) {

            selectedOptionsDiv.innerHTML = textInicial;

        } else {

            if (selectedOptions.length > limitShowOptions) {
                selectedOptionsDiv.innerHTML = selectedOptions.slice(0, limitShowOptions).join(' ') + createTag('+' + selectedOptions.slice(limitShowOptions, selectedOptions.length).length, false);

            } else {
                selectedOptionsDiv.innerHTML = selectedOptions.join(' ');
            }

        }

        const closeButtons = selectedOptionsDiv.querySelectorAll('.tag-mult-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault()
                const label = event.target.parentElement;
                const checkbox = dropdown.querySelector(`input[data-label="${label.textContent.trim()}"]`);
                if (checkbox) {
                    checkbox.checked = false; // Desmarca o checkbox
                }
                label.remove(); // Remove a tag visual
                updateSelectedOptions(); // Atualiza a seleção
            });
        });
    }
    
}