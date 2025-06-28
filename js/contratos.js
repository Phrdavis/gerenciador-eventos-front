$(document).ready(async function () {

    const actionsContratos = [
        {
            label: "Filtro",
            icon: "bi bi-filter",
            disabled: true
        },
        {
            label: "Incluir",
            icon: "bi bi-plus",
            action: ()=>{ modalIncluiContratoOpen() },
            disabled: false
        }
    ]

    function onInit(){
        aplicarFiltroTabela("search-contrato-input", "table-contratos");
        actionsMenuDrop(document.querySelector('.drop-actions-menu'), actionsContratos);
        carregarContratos();
    }

    function carregarContratos(){

        $.get("http://localhost:8081/api/contratos", function (contratos) {
            const tbody = $("#table-contratos tbody");
            tbody.empty(); // Limpa o corpo da tabela
    
            contratos.forEach(contrato => {
                const linha = `
                    <tr>
                        <td>${contrato.nome || '-'}</td>
                        <td>${limitarTexto(contrato.descricao, 50) || '-'}</td>
                        <td>${formatarData(contrato.dataInicio) || '-'}</td>
                        <td>${formatarData(contrato.dataFim) || '-'}</td>
                        <td class="text-center"><span class="badge-modalidades m-auto badge bg-opacity-25 fw-bold bg-${modalidadesBadge(contrato.modalidades?.length)} text-${modalidadesBadge(contrato.modalidades?.length)} rounded">${contrato.modalidades?.length || '0'}</span></td>
                        <td class="text-center">
                            <div class="dropdown">
                                <button class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-dark text-small shadow" style="z-index: 1000;">
                                    <li><a class="dropdown-item btn-detalhes-contrato" data-id="${contrato.id}" href="#">Detalhes</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item text-danger btn-delete-contrato" data-id="${contrato.id}" href="#">Excluir</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                `;
                tbody.append(linha);
            });
        }).fail(function () {
            appendAlert("Erro ao carregar contratos!", "danger")
        });

    }

    $('#table-contratos').on('click', '.btn-detalhes-contrato', function () {
        const contratoId = $(this).data('id');

        $.get(`http://localhost:8081/api/contratos/${contratoId}`, function (contrato) {

            $('#contrato_id').val(contrato.id);
            $('#contrato_nome').val(contrato.nome);
            $('#contrato_descricao').val(contrato.descricao);
            $('#contrato_inicio').val(contrato.dataInicio);
            $('#contrato_fim').val(contrato.dataFim);
            $('#contratoModalLabel').html(`${contrato.id} - ${contrato.nome}`);
            $('#table_modalidades tbody').empty();
            carregaModalidadesTable(contrato.modalidades);
            $('#contratoModal').modal('show');
        }).fail(function (erro) {
            appendAlert(erro.responseJSON.erro, "danger")
        });
    });
    
    function modalIncluiContratoOpen(){

        $('#contratoForm')[0].reset();
        $('#contrato_id').val("");
        $('#contratoModalLabel').html("Incluir Contrato");
        $('#table_modalidades tbody').empty();
        $('#contratoModal').modal('show');

    }

    function modalidadesBadge(qtd) {
        switch (qtd){
            case 0:
                return 'danger'
            case 1:
                return 'warning'
            default:
                return 'success'
        }
    }

    $('#table-contratos').on('click', '.btn-delete-contrato', async function(e) {
        const contratoId = $(this).data('id');
        if (confirm('Tem certeza que deseja deletar este contrato?')) {
            try {
                const response = await fetch(`http://localhost:8081/api/contratos/${contratoId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    appendAlert('Contrato deletado com sucesso!', 'success');
                    carregarContratos();
                } else {
                    const data = await response.json();
                    appendAlert(data.erro || 'Falha ao deletar contrato.', 'danger');
                }

            } catch (error) {
                appendAlert('Erro ao conectar ao servidor.', 'danger');
            }
        }
    });

    $('#contratoForm').on('submit', function (e) {
        e.preventDefault();

        const id = $('#contrato_id').val();
        const isEdicao = id !== "";

        // Monta os dados do formulário
        const contrato = {
            id: id || null,
            nome: $('#contrato_nome').val(),
            descricao: $('#contrato_descricao').val(),
            dataInicio: $('#contrato_inicio').val(),
            dataFim: $('#contrato_fim').val(),
            modalidades: $('#table_modalidades tbody tr').map(function() {
                return { 
                    id: $(this).find('input[type="hidden"]').val(), 
                    nome: $(this).find('td').eq(0).text().trim(), 
                    valor: $(this).find('td').eq(1).text().trim() 
                }
            }).get()
        };

        console.log(contrato)

        const metodo = isEdicao ? 'PUT' : 'POST';
        const url = isEdicao 
            ? `http://localhost:8081/api/contratos/${id}` 
            : 'http://localhost:8081/api/contratos';

        $.ajax({
            url: url,
            type: metodo,
            contentType: 'application/json',
            data: JSON.stringify(contrato),
            success: function () {
                appendAlert(isEdicao ? 'Contrato atualizado com sucesso!' : 'Contrato criado com sucesso!', "success")

                $('#contratoModal').modal('hide');
                $('#contratoForm')[0].reset();
                carregarContratos();

            },
            error: function (erro) {
                appendAlert(erro.responseJSON?.erro, "danger")
            }
        });
    });
    
    $('#modalidade_adicionar').on('click', function () {

        var nome = $('#modalidade_nome').val();
        var valor = $('#modalidade_valor').val();

        
        if (nome && valor) {
            
            var exists = false;
            $('#table_modalidades tbody tr').each(function() {
                var existingNome = $(this).find('td').eq(0).text();
                var existingValor = $(this).find('td').eq(1).text();
                if (existingNome === nome && existingValor === valor) {
                    exists = true;
                    return false;
                }
            });

            if (!exists) {
                
                var newRow = `
                    <tr>
                        <td>${nome}</td>
                        <td>${valor}</td>
                        <td class="text-center"><div class="btn btn-danger btn-excluir"><i class="bi bi-trash"></i></div></td>
                    </tr>
                `;

                $('#table_modalidades tbody').append(newRow);

                $('#modalidade_nome').val('');
                $('#modalidade_valor').val('');
            } else {
                alert("Essa combinação de Nome e Valor já existe na tabela.");
            }
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    });

    $('#table_modalidades').on('click', '.btn-excluir', function () {
        
        $(this).closest('tr').remove();
    });

    function carregaModalidadesTable(modalidades){
        modalidades.forEach(modalidade => {
            var newRow = `
                <tr>
                    <input type="hidden" value="${modalidade.id}">
                    <td>${modalidade.nome}</td>
                    <td>${modalidade.valor}</td>
                    <td class="text-center"><div class="btn btn-danger btn-excluir"><i class="bi bi-trash"></i></div></td>
                </tr>
            `;
            $('#table_modalidades tbody').append(newRow);
        });
    }

    onInit();

})