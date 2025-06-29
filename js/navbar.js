(function() {

    const currentPage = window.location.pathname.split('/').pop();

    const sidebarItems = [
        {
            icon: "bi bi-bar-chart-line",
            icon_active: "bi bi-bar-chart-line-fill",
            label: "Dashboard",
            link: "#",
            isActive: currentPage === "dashboard.html",
            disabled: true
        },
        {
            icon: "bi bi-file-earmark-richtext",
            icon_active: "bi bi-file-earmark-richtext-fill",
            label: "Contratos",
            link: "contratos.html",
            isActive: currentPage === "contratos.html",
            disabled: false
        },
        {
            icon: "bi bi-calendar-event",
            icon_active: "bi bi-calendar-event-fill",
            label: "Eventos",
            link: "eventos.html",
            isActive: currentPage === "eventos.html",
            disabled: false
        },
        {
            icon: "bi bi-people",
            icon_active: "bi bi-people-fill",
            label: "Tecnicos",
            link: "tecnicos.html",
            isActive: currentPage === "tecnicos.html",
            disabled: false
        }
    ];

    let sidebarHTML = `
        <nav class="sidebar d-flex flex-column position-relative">
            <div class="d-flex justify-contente-center align-items-center">
                <a href="#" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <img src="https://img.icons8.com/?size=100&id=AkuCHGqveoj4&format=png&color=000000" alt="Logo" width="32" height="32" class="me-2">
                    <span class="fs-4">EventEase</span>
                </a>
            </div>
            <hr>
            <ul class="nav nav-pills flex-column mb-auto">`;

    sidebarItems.forEach(item => {
        sidebarHTML += `
            <li class="nav-item">
                <a href="${item.link}" class="nav-link ${item.isActive ? 'active' : ''} ${item.disabled ? 'disabled' : ''}" aria-current="page">
                    <i class="bi ${item.isActive ? item.icon_active : item.icon}"></i>
                    ${item.label}
                </a>
            </li>`;
    });

    // Sidebar do usuário (comentado para você personalizar conforme necessário)
    /*
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        user = null;
    }
    const userName = user && user.nome ? user.nome : 'Usuário';
    */

    function logout() {
        localStorage.removeItem('user');
    }

    $(function() {

        // Função para alternar a visibilidade da sidebar
        $('#toggle-sidebar-close').on('click', function() {
            $('#toggle-sidebar-open').removeClass('ocult')
            $('.sidebar').addClass('sidebar-hidden');
        });

        // Função para alternar a visibilidade da sidebar
        $('#toggle-sidebar-open').on('click', function() {
            
            $('#toggle-sidebar-open').addClass('visible')
            $('.sidebar').removeClass('sidebar-hidden');
        });
    });

    // Adiciona o HTML da sidebar
    document.getElementById('sidebar-component').innerHTML = sidebarHTML;

})();
