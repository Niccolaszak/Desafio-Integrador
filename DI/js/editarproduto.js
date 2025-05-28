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

    // Salva os valores antigos para comparação
    const antigo = { ...livros[idx] };

    // Atualiza com os novos valores
    livros[idx].titulo = this.titulo.value.trim();
    livros[idx].autor = this.autor.value.trim();
    livros[idx].genero = this.genero.value.trim();
    livros[idx].quantidade = parseInt(this.quantidade.value, 10);

    localStorage.setItem('livros', JSON.stringify(livros));

    // Monta detalhes do que foi alterado
    let detalhes = [];
    if (antigo.titulo !== livros[idx].titulo)
        detalhes.push(`Título: "${antigo.titulo}" → "${livros[idx].titulo}"`);
    if (antigo.autor !== livros[idx].autor)
        detalhes.push(`Autor: "${antigo.autor}" → "${livros[idx].autor}"`);
    if (antigo.genero !== livros[idx].genero)
        detalhes.push(`Gênero: "${antigo.genero}" → "${livros[idx].genero}"`);
    if (antigo.quantidade !== livros[idx].quantidade)
        detalhes.push(`Quantidade: ${antigo.quantidade} → ${livros[idx].quantidade}`);

    registrarMovimentacao(
        'Edição',
        detalhes.length > 0
            ? `Livro editado: ${livros[idx].titulo} (ID: ${livros[idx].id}). Alterações: ${detalhes.join('; ')}`
            : `Livro editado: ${livros[idx].titulo} (ID: ${livros[idx].id}). Nenhuma alteração nos dados.`
    );
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

function registrarMovimentacao(acao, detalhes) {
    const usuario = localStorage.getItem('usuarioLogado') || 'Desconhecido';
    const dataHora = new Date().toLocaleString('pt-BR');
    const movimentos = JSON.parse(localStorage.getItem('movimentosEstoque')) || [];
    movimentos.unshift({
        dataHora,
        usuario,
        acao,
        detalhes
    });
    localStorage.setItem('movimentosEstoque', JSON.stringify(movimentos));
}