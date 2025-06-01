// Controle do tema claro/escuro
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Função para alternar o tema
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

// Evento para alternar tema ao clicar no botão
toggleBtn.addEventListener('click', () => {
    const isDark = !body.classList.contains('dark-mode');
    setTheme(isDark);
});

// Aplica o tema salvo ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('tema');
    setTheme(temaSalvo === 'dark');
});

// Lógica do formulário de adição de livro
document.getElementById('form-add-livro').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const titulo = form.titulo.value.trim();
    const autor = form.autor.value.trim();
    const genero = form.genero.value.trim();
    const quantidade = parseInt(form.quantidade.value, 10);

    // Validação simples dos campos
    if (!titulo || !autor || !genero || !quantidade) {
        alert('Preencha todos os campos!');
        return;
    }

    let livros = JSON.parse(localStorage.getItem('livros')) || [];
    // Verifica se já existe um livro igual (título, autor e gênero)
    const idxExistente = livros.findIndex(l =>
        l.titulo.trim().toLowerCase() === titulo.toLowerCase() &&
        l.autor.trim().toLowerCase() === autor.toLowerCase() &&
        l.genero.trim().toLowerCase() === genero.toLowerCase()
    );

    // Se já existe, pergunta se deseja somar a quantidade
    if (idxExistente !== -1) {
        const confirmar = confirm(
            'Já existe um livro com esse título, autor e gênero.\nDeseja adicionar a quantidade ao livro já existente?'
        );
        if (confirmar) {
            livros[idxExistente].quantidade += quantidade;
            localStorage.setItem('livros', JSON.stringify(livros));
            registrarMovimentacao(
                'Adição',
                `Adicionou ${quantidade} ao livro existente: ${livros[idxExistente].titulo} (ID: ${livros[idxExistente].id})`
            );
            window.location.href = "index.html";
        }
        return;
    }

    // Gera o menor ID disponível para o novo livro
    let novoId = 1;
    const idsUsados = livros.map(l => l.id).sort((a, b) => a - b);
    for (let i = 0; i < idsUsados.length; i++) {
        if (idsUsados[i] !== i + 1) {
            novoId = i + 1;
            break;
        }
        novoId = idsUsados.length + 1;
    }

    // Adiciona o novo livro ao array
    livros.push({
        id: novoId,
        titulo,
        autor,
        genero,
        quantidade
    });
    localStorage.setItem('livros', JSON.stringify(livros));
    registrarMovimentacao(
        'Adição',
        `Livro adicionado: ${titulo} (ID: ${novoId})`
    );
    window.location.href = "index.html";
});

// Redireciona para login se não houver usuário logado
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

// Controle da sidebar (menu lateral)
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('side-bar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('aberta');
            document.body.classList.toggle('menu-aberto');
        });

        // Fecha a sidebar ao clicar fora dela
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

// Função para registrar movimentações no estoque
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