$(document).ready(function() {
    // Função para mudar o conteúdo da tab
    function loadTabContent(tabName) {
        const $tabContent = $('#tab-content');
        fetch(`templates/evento-tabs/${tabName}.html`)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error("Erro ao carregar o conteúdo");
                }
            })
            .then(htmlContent => {
                $tabContent.html(htmlContent);  // Insere o conteúdo carregado
            })
            .catch(error => {
                $tabContent.html(`<p>Erro ao carregar o conteúdo da tab.</p>`);
            });
    }

    // Evento de clique nas tabs
    $('.tab-item').on('click', function(e) {
        e.preventDefault();
        $('.tab-item a').removeClass('active');
        $(this).find('a').addClass('active');
        loadTabContent($(this).find('a').data('tab'));
    });

    // Carregar conteúdo inicial da primeira tab
    loadTabContent('evento-tab');
});
