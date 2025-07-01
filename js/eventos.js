$(document).ready(async function () {

    const actionsEventos = [
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
        },
        {
            label: "importar",
            icon: "bi bi-upload",
            action: ()=>{ modalImportaEventosOpen() },
            disabled: false
        }
    ]

    function carregarEventos(){

        $.get("http://localhost:8081/api/eventos", function (eventos) {
            const tbody = $("#table-eventos tbody");
            tbody.empty(); // Limpa o corpo da tabela
    
            eventos.forEach(evento => {
                const linha = `
                    <tr>
                        <td>${evento.numSolicitacao || '-'}</td>
                        <td>${evento.nome || '-'}</td>
                        <td>${evento.destino || '-'}</td>
                        <td>${limitarTexto(evento.descricao, 20) || '-'}</td>
                        <td>${formatarData(evento.data) || '-'}</td>
                        <td>${formatarData(evento.inicio) || '-'}</td>
                        <td>${formatarData(evento.fim) || '-'}</td>
                        <td>${evento.horaInicio || '-'}</td>
                        <td>${evento.horaFim || '-'}</td>
                        <td>${limitarTexto(evento.local, 20) || '-'}</td>
                        <td>${evento.responsavel || '-'}</td>
                        <td class="text-center">
                            <div class="dropdown">
                                <button class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-dark text-small shadow" style="z-index: 1000;">
                                    <li><a class="dropdown-item btn-detalhes-evento" data-id="${evento.id}" href="#">Detalhes</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item text-danger btn-delete-evento" data-id="${evento.id}" href="#">Excluir</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                `;
                tbody.append(linha);
            });
        }).fail(function () {
            appendAlert("Erro ao carregar eventos!", "danger")
        });

    }

    function modalImportaEventosOpen(){
        $('#modalImportarArquivo').modal('show');
    }

    $('#form-importar').on('submit', function (e) {
        e.preventDefault();

        const arquivos = $('#arquivo')[0].files;
        if (arquivos.length === 0) {
            appendAlert("Selecione pelo menos um arquivo PDF.", "warning")
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < arquivos.length; i++) {
            formData.append('arquivos', arquivos[i]);
        }

        $.ajax({
            url: 'http://localhost:8081/api/eventos/upload',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (resposta) {
                appendAlert("Arquivos enviados com sucesso!", "success")
                $('#form-importar')[0].reset();
                $('#modalImportarArquivo').modal('hide');

                carregarEventos();
            },
            error: function (erro) {
                $('#modalImportarArquivo').modal('hide');
                console.log(erro.responseJSON)
                appendAlert(erro.responseJSON.erro, "danger")
            }
        });
    });

    function modalIncluiEventoOpen(){

        $('#eventoForm')[0].reset();
        $('#evento_id').val("");
        $('#eventoModalLabel').html("Incluir Evento");
        $('#eventoModal').modal('show');

    }

    $('#table-eventos').on('click', '.btn-detalhes-evento', function () {
        const eventoId = $(this).data('id');
        window.location.href = `eventos-detalhes.html?id=${eventoId}`;
    });

    $('#table-eventos').on('click', '.btn-delete-evento', async function(e) {
        const eventoId = $(this).data('id');
        if (confirm('Tem certeza que deseja deletar este evento?')) {
            try {
                const response = await fetch(`http://localhost:8081/api/eventos/${eventoId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    appendAlert('Evento deletado com sucesso!', 'success');
                    carregarEventos();
                } else {
                    const data = await response.json();
                    appendAlert(data.erro || 'Falha ao deletar evento.', 'danger');
                }

            } catch (error) {
                appendAlert('Erro ao conectar ao servidor.', 'danger');
            }
        }
    });

    $('#eventoForm').on('submit', function (e) {
        e.preventDefault();

        const id = $('#evento_id').val();
        const isEdicao = id !== "";

        // Monta os dados do formulário
        const evento = {
            id: id || null,
            nome: $('#evento_nome').val(),
            numSolicitacao: $('#evento_numSolicitacao').val(),
            destino: $('#evento_destino').val(),
            descricao: $('#evento_descricao').val(),
            data: $('#evento_data').val(),
            inicio: $('#evento_inicio').val(),
            fim: $('#evento_fim').val(),
            horaInicio: $('#evento_horaInicio').val(),
            horaFim: $('#evento_horaFim').val(),
            local: $('#evento_local').val(),
            responsavel: $('#evento_responsavel').val(),
            telefoneResponsavel: $('#evento_telefone').val()
        };

        const metodo = isEdicao ? 'PUT' : 'POST';
        const url = isEdicao 
            ? `http://localhost:8081/api/eventos/${id}` 
            : 'http://localhost:8081/api/eventos';

        $.ajax({
            url: url,
            type: metodo,
            contentType: 'application/json',
            data: JSON.stringify(evento),
            success: function () {
                appendAlert(isEdicao ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!', "success")

                $('#eventoModal').modal('hide');
                $('#eventoForm')[0].reset();
                carregarEventos();
                
            },
            error: function (erro) {
                appendAlert(erro.responseJSON?.erro, "danger")
            }
        });
    });

    function onInit(){
        
        aplicarFiltroTabela("search-evento-input", "table-eventos")
        actionsMenuDrop(document.querySelector('.drop-actions-menu'), actionsEventos);
        carregarEventos();
    }

    onInit()

});

