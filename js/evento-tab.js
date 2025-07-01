$(document).ready(function () {

    function getIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    const eventoId = getIdFromUrl();
    
    function onInit(){
        carregarEvento(eventoId);
        
        $('#modalidade').select2({
            theme: 'bootstrap-5',  // Usa o tema do Bootstrap 4
            placeholder: "Selecione uma Modalidade",  // Placeholder do campo de pesquisa
        });
    }

    function carregarEvento(id) {
        $.ajax({
            url: `http://localhost:8081/api/eventos/${id}`,
            method: 'GET',
            dataType: 'json',
            success: function(evento) {
                console.log(evento)
                $('#nome-evento').text(`${evento.id} - ${evento.nome || ''}`);
                $('#nome').val(evento.nome || '');
                $('#destino').val(evento.destino || '');
                $('#descricao').val(evento.descricao || '');
                $('#numSolicitacao').val(evento.numSolicitacao || '');
                $('#data').val(evento.data || '');
                $('#inicio').val(evento.inicio || '');
                $('#fim').val(evento.fim || '');
                $('#horaInicio').val(evento.horaInicio || '');
                $('#horaFim').val(evento.horaFim || '');
                $('#local').val(evento.local || '');
                $('#responsavel').val(evento.responsavel || '');
                $('#telefoneResponsavel').val(evento.telefoneResponsavel || '');
                evento.contrato != null ? carregarModalidades(evento.contrato.modalidades, evento.modalidade) : $('#modalidade').val(null);
            },
            error: function() {
                alert('Não foi possível carregar o evento.');
            }
        });
    }

    function carregarModalidades(modalidades, modalidadeSelecionada) {
        $("#modalidade").empty();
        modalidades.forEach(function(modalidade) {
            $("#modalidade").append(new Option(modalidade.nome, modalidade.id, '',modalidadeSelecionada));

        });
    }

    onInit()
});
