const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    function setTheme(dark) {
        if (dark) {
            body.classList.add('dark-mode');
            toggleBtn.textContent = '☀️';
            localStorage.setItem('tema', 'dark');
        } else {
            body.classList.remove('dark-mode');
            toggleBtn.textContent = '🌙';
            localStorage.setItem('tema', 'light');
        }
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = !body.classList.contains('dark-mode');
        setTheme(isDark);
    });

    window.addEventListener('DOMContentLoaded', () => {
        const temaSalvo = localStorage.getItem('tema');
        setTheme(temaSalvo === 'dark');
    });
   
    window.addEventListener('DOMContentLoaded', () => {
        const usuario = localStorage.getItem('usuarioLogado');
        if (usuario) {
            document.getElementById('usuario-logado-nome').innerHTML = `
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" style="vertical-align:middle;margin-right:3px;">
                    <circle cx="10" cy="7" r="4"/>
                    <path d="M2 18c0-3.3 3.6-6 8-6s8 2.7 8 6"/>
                </svg>
                ${usuario}
            `;
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('usuarioLogado');
                window.location.href = "login.html";
            });
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('side-bar');

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('aberta');
                document.body.classList.toggle('menu-aberto');
            });
            // Fecha a sidebar ao clicar fora dela (opcional)
            document.addEventListener('click', (e) => {
                if (
                    sidebar.classList.contains('aberta') &&
                    !sidebar.contains(e.target) &&
                    e.target !== menuToggle &&
                    !menuToggle.contains(e.target)
                ) {
                    sidebar.classList.remove('aberta');
                    document.body.classList.remove('menu-aberto');
                }
            });
        }
    });


document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('movimentos-tbody');
    const movimentos = JSON.parse(localStorage.getItem('movimentosEstoque')) || [];

    if (movimentos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhuma movimentação registrada.</td></tr>`;
        return;
    }

    tbody.innerHTML = movimentos.map(mov => `
        <tr>
            <td>${mov.dataHora}</td>
            <td>${mov.usuario}</td>
            <td>${mov.acao}</td>
            <td>${mov.detalhes}</td>
        </tr>
    `).join('');
});