window.addEventListener('DOMContentLoaded', () => {
    // Cria 3 usuários fixos se ainda não existirem
    const usuariosPadrao = [
        { usuario: 'nicolas', senha: 'nicolas123' },
        { usuario: 'alisson', senha: 'alisson123' },
        { usuario: 'vinicius', senha: 'vinicius123' }
    ];
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify(usuariosPadrao));
    } else {
        // Garante que os 3 usuários estejam presentes
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
    e.preventDefault();
    const usuario = this.usuario.value.trim();
    const senha = this.senha.value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const encontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);

    const erroDiv = document.getElementById('login-erro');
    if (encontrado) {
        localStorage.setItem('usuarioLogado', usuario);
        window.location.href = "index.html";
    } else {
        erroDiv.textContent = "Usuário ou senha incorretos!";
        erroDiv.style.display = "block";
    }
});