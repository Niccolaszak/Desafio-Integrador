window.addEventListener('DOMContentLoaded', () => {
    // Define os usuários padrão
    const usuariosPadrao = [
        { usuario: 'nicolas', senha: 'nicolas123' },
        { usuario: 'alisson', senha: 'alisson123' },
        { usuario: 'vinicius', senha: 'vinicius123' }
    ];
    // Se não houver usuários salvos, cria os 3 padrões
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify(usuariosPadrao));
    } else {
        // Garante que os 3 usuários estejam presentes mesmo se o array já existir
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        usuariosPadrao.forEach(u => {
            if (!usuarios.find(us => us.usuario === u.usuario)) {
                usuarios.push(u);
            }
        });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    // Obtém os valores digitados pelo usuário
    const usuario = this.usuario.value.trim();
    const senha = this.senha.value;

    // Busca os usuários cadastrados no localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    // Procura um usuário com login e senha correspondentes
    const encontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);

    const erroDiv = document.getElementById('login-erro');
    if (encontrado) {
        // Se encontrado, salva o usuário logado e redireciona para a página principal
        localStorage.setItem('usuarioLogado', usuario);
        window.location.href = "index.html";
    } else {
        // Se não encontrado, exibe mensagem de erro
        erroDiv.textContent = "Usuário ou senha incorretos!";
        erroDiv.style.display = "block";
    }
});