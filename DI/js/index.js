// Seleciona o botão de alternância de tema e o body
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Função para alternar entre tema claro e escuro
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

// Evento para alternar o tema ao clicar no botão
toggleBtn.addEventListener('click', () => {
    const isDark = !body.classList.contains('dark-mode');
    setTheme(isDark);
});

// Aplica o tema salvo ao carregar a página e renderiza a tabela de livros
window.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('tema');
    setTheme(temaSalvo === 'dark');
    renderTabelaLivros();
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

// Função para renderizar a tabela de livros na página
function renderTabelaLivros() {
    const tbody = document.querySelector('.produtos-table tbody');
    let livros = JSON.parse(localStorage.getItem('livros')) || [];
    livros.sort((a, b) => a.id - b.id);

    let html = '';
    livros.forEach(livro => {
        html += `
            <tr>
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.genero}</td>
                <td>${livro.quantidade}</td>
                <td>
                    <button class="edit-btn" data-id="${livro.id}">Editar</button>
                    <button class="remove-btn" data-id="${livro.id}">Remover</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    // Adiciona eventos aos botões de remover
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = Number(this.getAttribute('data-id'));
            const confirmacao = confirm('Tem certeza que deseja remover este livro do estoque?');
            if (!confirmacao) return;
            let livros = JSON.parse(localStorage.getItem('livros')) || [];
            const livroRemovido = livros.find(livro => livro.id === id);
            livros = livros.filter(livro => livro.id !== id);
            registrarMovimentacao(
                'Remoção',
                `Livro removido: ${livroRemovido ? livroRemovido.titulo : 'ID ' + id}`
            );
            localStorage.setItem('livros', JSON.stringify(livros));
            renderTabelaLivros();
        });
    });

    // Adiciona eventos aos botões de editar
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            window.location.href = `editarproduto.html?id=${id}`;
        });
    });
}

// Controle da sidebar (menu lateral)
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




