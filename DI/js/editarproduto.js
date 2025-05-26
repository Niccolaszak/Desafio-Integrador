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
    carregarLivroParaEdicao();
});

function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('id'));
}

function carregarLivroParaEdicao() {
    const id = getIdFromUrl();
    let livros = JSON.parse(localStorage.getItem('livros')) || [];
    const livro = livros.find(l => l.id === id);

    if (!livro) {
        alert('Livro não encontrado!');
        window.location.href = "index.html";
        return;
    }

    const form = document.getElementById('form-editar-livro');
    form.titulo.value = livro.titulo;
    form.autor.value = livro.autor;
    form.genero.value = livro.genero;
    form.quantidade.value = livro.quantidade;
}

document.getElementById('form-editar-livro').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = getIdFromUrl();
    let livros = JSON.parse(localStorage.getItem('livros')) || [];
    const idx = livros.findIndex(l => l.id === id);

    if (idx === -1) {
        alert('Livro não encontrado!');
        window.location.href = "index.html";
        return;
    }

    livros[idx].titulo = this.titulo.value.trim();
    livros[idx].autor = this.autor.value.trim();
    livros[idx].genero = this.genero.value.trim();
    livros[idx].quantidade = parseInt(this.quantidade.value, 10);

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