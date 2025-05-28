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

document.getElementById('form-add-livro').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const titulo = form.titulo.value.trim();
    const autor = form.autor.value.trim();
    const genero = form.genero.value.trim();
    const quantidade = parseInt(form.quantidade.value, 10);

    if (!titulo || !autor || !genero || !quantidade) {
        alert('Preencha todos os campos!');
        return;
    }

    let livros = JSON.parse(localStorage.getItem('livros')) || [];
    // Verifica se já existe um livro com mesmo título, autor e gênero (case insensitive)
    const idxExistente = livros.findIndex(l =>
        l.titulo.trim().toLowerCase() === titulo.toLowerCase() &&
        l.autor.trim().toLowerCase() === autor.toLowerCase() &&
        l.genero.trim().toLowerCase() === genero.toLowerCase()
    );

    if (idxExistente !== -1) {
        const confirmar = confirm(
            'Já existe um livro com esse título, autor e gênero.\nDeseja adicionar a quantidade ao livro já existente?'
        );
        if (confirmar) {
            livros[idxExistente].quantidade += quantidade;
            localStorage.setItem('livros', JSON.stringify(livros));
            window.location.href = "index.html";
        }
        return;
    }

    // Encontra o menor ID disponível
    let novoId = 1;
    const idsUsados = livros.map(l => l.id).sort((a, b) => a - b);
    for (let i = 0; i < idsUsados.length; i++) {
        if (idsUsados[i] !== i + 1) {
            novoId = i + 1;
            break;
        }
        // Se todos os anteriores estão ocupados, novoId será o próximo
        novoId = idsUsados.length + 1;
    }

    livros.push({
        id: novoId,
        titulo,
        autor,
        genero,
        quantidade
    });

    localStorage.setItem('livros', JSON.stringify(livros));
    window.location.href = "index.html";
});

if (!localStorage.getItem('usuarioLogado')) {
    window.location.href = "login.html";
}

// Exibe usuário logado e botão de logout
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