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
    renderDashboard();
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

function renderDashboard() {
    const livros = JSON.parse(localStorage.getItem('livros')) || [];
    const totalLivros = livros.length;
    const totalExemplares = livros.reduce((acc, l) => acc + Number(l.quantidade), 0);
    const maiorEstoque = livros.reduce((max, l) => l.quantidade > (max?.quantidade || 0) ? l : max, null);
    const menorEstoque = livros.reduce((min, l) => l.quantidade < (min?.quantidade || Infinity) ? l : min, null);

    // Cards
    const cards = [
        { label: "Livros cadastrados", value: totalLivros },
        { label: "Total em estoque", value: totalExemplares },
        { label: "Maior estoque", value: maiorEstoque ? `${maiorEstoque.titulo} (${maiorEstoque.quantidade})` : '-' },
        { label: "Menor estoque", value: menorEstoque ? `${menorEstoque.titulo} (${menorEstoque.quantidade})` : '-' }
    ];

    document.getElementById('dashboard-cards').innerHTML = cards.map(card => `
        <div style="background:#2563eb;color:#fff;padding:1rem 2rem;border-radius:8px;min-width:180px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <div style="font-size:1.2rem;font-weight:bold;">${card.value}</div>
            <div style="font-size:0.95rem;">${card.label}</div>
        </div>
    `).join('');

    // Top 10 maiores estoques
    const maiores = [...livros]
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 7);

    // Top 10 menores estoques
    const menores = [...livros]
        .sort((a, b) => a.quantidade - b.quantidade)
        .slice(0, 7);

    // Gráfico dos 10 maiores estoques
    const ctxMaiores = document.getElementById('grafico-maiores').getContext('2d');
    new Chart(ctxMaiores, {
        type: 'bar',
        data: {
            labels: maiores.map(l => quebraTitulo(l.titulo)),
            datasets: [{
                label: 'Quantidade em estoque',
                data: maiores.map(l => l.quantidade),
                backgroundColor: '#2563eb'
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 }
                },
                y: { beginAtZero: true }
            }
        }
    });

    // Gráfico dos 10 menores estoques
    const ctxMenores = document.getElementById('grafico-menores').getContext('2d');
    new Chart(ctxMenores, {
        type: 'bar',
        data: {
            labels: menores.map(l => quebraTitulo(l.titulo)),
            datasets: [{
                label: 'Quantidade em estoque',
                data: menores.map(l => l.quantidade),
                backgroundColor: '#fbbf24'
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 }
                },
                y: { beginAtZero: true }
            }
        }
    });
}

function quebraTitulo(titulo) {
    const limite = 30; // número de caracteres por linha
    if (titulo.length <= limite) return titulo;
    let idx = titulo.lastIndexOf(' ', limite);
    if (idx === -1) idx = limite;
    // Retorna um array: cada item é uma linha
    return [titulo.slice(0, idx), titulo.slice(idx + 1)];
}