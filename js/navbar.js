(function() {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebar = document.getElementById('sidebar-component');

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
        <a id="close-btn">
            <i class="bi bi-x-lg"></i> <!-- Ícone de menu (hamburger) -->
        </a>
        <nav class="sidebar d-flex flex-column position-relative">
            <div class="d-flex justify-contente-center align-items-center">
                <a href="home.html" class="d-flex align-items-center mb-0 me-md-auto text-white text-decoration-none">
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

    // Função para alternar a visibilidade da sidebar
    function toggleSidebar() {
        const toggleButton = document.getElementById('toggle-sidebar-btn');
        const sidebar = document.querySelector('.sidebar');
        const title = document.querySelector('.title');
        const links = document.querySelector('.list-links');
        toggleButton.classList.toggle('toggle-btn');
        sidebar.classList.toggle('sidebar-expand');
        if(title != null){
            title.classList.toggle('title-responsive');
        }
        if(links != null){
            links.classList.toggle('list-links-responsive');
        }
    }

    // Adiciona o HTML da sidebar
    sidebar.innerHTML = sidebar.innerHTML + sidebarHTML;

    // Lidar com o clique no botão de abrir a sidebar
    document.getElementById('toggle-sidebar-btn').addEventListener('click', function() {
        toggleSidebar();
    });
    document.getElementById('close-btn').addEventListener('click', function() {
        toggleSidebar();
    });
})();
