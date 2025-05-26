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
    let novoId = livros.length > 0 ? Math.max(...livros.map(l => l.id)) + 1 : 1;

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