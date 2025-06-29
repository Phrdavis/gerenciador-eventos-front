$(document).ready(function() {

    const actionsTecnicos = [
        {
            label: "Filtro",
            icon: "bi bi-filter",
            disabled: true
        },
        {
            label: "Incluir",
            icon: "bi bi-plus",
            action: ()=>{ modalIncluiEventoOpen() },
            disabled: false
        }
    ]

    function onInit(){

        aplicarFiltroTabela("search-tecnico-input", "table-tecnicos")
        actionsMenuDrop(document.querySelector('.drop-actions-menu'), actionsTecnicos);  
        carregarTecnicos();
    }

    function carregarTecnicos() {
        $.get("http://localhost:8081/api/tecnicos", function (tecnicos) {
            const tbody = $("#table-tecnicos tbody");
            tbody.empty(); // Limpa o corpo da tabela

            tecnicos.forEach(tecnico => {
                const linha = `
                    <tr>
                        <td>${tecnico.nome || '-'}</td>
                        <td>${tecnico.telefone || '-'}</td>
                        <td>${tecnico.email || '-'}</td>
                        <td>${tecnico.diaria || '-'}</td>
                        <td class="text-center">
                            <div class="dropdown">
                                <button class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-dark text-small shadow" style="z-index: 1000;">
                                    <li><a class="dropdown-item btn-detalhes-tecnico" data-id="${tecnico.id}" href="#">Detalhes</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item text-danger btn-delete-tecnico" data-id="${tecnico.id}" href="#">Excluir</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                `;
                tbody.append(linha);
            });
        }).fail(function () {
            appendAlert("Erro ao carregar técnicos!", "danger");
        });
    }

    // Abre o modal para inclusão de técnico
    function modalIncluiEventoOpen() {
        $('#tecnicoForm')[0].reset();
        $('#tecnico_id').val("");
        $('#tecnico_telefone').mask('(00) 00000-0000');
        $('#tecnico_valor').mask('000000000000000.00', {reverse: true});
        $('#tecnicoModalLabel').html("Incluir Técnico");
        $('#tecnicoModal').modal('show');
    }

    // Detalhes do técnico
    $('#table-tecnicos').on('click', '.btn-detalhes-tecnico', function () {
        const tecnicoId = $(this).data('id');
        $.get(`http://localhost:8081/api/tecnicos/${tecnicoId}`, function (tecnico) {
            $('#tecnico_id').val(tecnico.id);
            $('#tecnico_nome').val(tecnico.nome);
            $('#tecnico_telefone').mask('(00) 00000-0000');
            $('#tecnico_telefone').val(tecnico.telefone);
            $('#tecnico_email').val(tecnico.email);
            $('#tecnico_valor').mask('000000000000000.00', {reverse: true});
            $('#tecnico_valor').val(tecnico.diaria);
            $('#tecnicoModalLabel').html(`${tecnico.nome}`);
            $('#tecnicoModal').modal('show');
        }).fail(function (erro) {
            appendAlert(erro.responseJSON?.erro || "Erro ao carregar técnico.", "danger");
        });
    });

    // Excluir técnico
    $('#table-tecnicos').on('click', '.btn-delete-tecnico', async function () {
        const tecnicoId = $(this).data('id');
        if (confirm('Tem certeza que deseja deletar este técnico?')) {
            try {
                const response = await fetch(`http://localhost:8081/api/tecnicos/${tecnicoId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    appendAlert('Técnico deletado com sucesso!', 'success');
                    carregarTecnicos();
                } else {
                    const data = await response.json();
                    appendAlert(data.erro || 'Falha ao deletar técnico.', 'danger');
                }
            } catch (error) {
                appendAlert('Erro ao conectar ao servidor.', 'danger');
            }
        }
    });

    // Salvar técnico (criar ou editar)
    $('#tecnicoForm').on('submit', function (e) {
        e.preventDefault();

        const id = $('#tecnico_id').val();
        const isEdicao = id !== "";

        const tecnico = {
            id: id || null,
            nome: $('#tecnico_nome').val(),
            telefone: $('#tecnico_telefone').val(),
            email: $('#tecnico_email').val(),
            diaria: $('#tecnico_valor').val().replace(",", ".")
        };

        console.log(tecnico)
        const metodo = isEdicao ? 'PUT' : 'POST';
        const url = isEdicao
            ? `http://localhost:8081/api/tecnicos/${id}`
            : 'http://localhost:8081/api/tecnicos';

        $.ajax({
            url: url,
            type: metodo,
            contentType: 'application/json',
            data: JSON.stringify(tecnico),
            success: function () {
                appendAlert(isEdicao ? 'Técnico atualizado com sucesso!' : 'Técnico criado com sucesso!', "success");
                $('#tecnicoModal').modal('hide');
                $('#tecnicoForm')[0].reset();
                carregarTecnicos();
            },
            error: function (erro) {
                console.log(erro.responseJSON)
                appendAlert(erro.responseJSON?.erro || "Erro ao salvar técnico.", "danger");
            }
        });
    });

    onInit()
});