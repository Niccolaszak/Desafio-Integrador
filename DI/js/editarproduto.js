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