let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function formatarPreco(valor) {

    return valor.toLocaleString('pt-BR', {

        style: 'currency',
        currency: 'BRL'
    });
}

function adicionarCarrinho(nome, preco) {

    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade++;

    } else {
        carrinho.push({
            id: Date.now(),
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    alert("Produto adicionado ao carrinho!");
}

function renderizar() {

    const lista = document.getElementById('lista-carrinho');

    if (!lista) return;

    const vazio = document.getElementById('carrinho-vazio');

    const resumo = document.getElementById('resumo');

    lista.innerHTML = '';

    if (carrinho.length === 0) {
        vazio.classList.add('visivel');
        resumo.style.display = 'none';
        return;
    }

    vazio.classList.remove('visivel');

    resumo.style.display = 'block';

    carrinho.forEach(item => {

        const div = document.createElement('div');

        div.className = 'item-carrinho';

        div.innerHTML = `

            <span class="item-nome">${item.nome}</span>

            <div class="item-quantidade">

                <button onclick="alterarQtd(${item.id}, -1)">−</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQtd(${item.id}, 1)">+</button>

            </div>

            <span class="item-preco">

                ${formatarPreco(item.preco * item.quantidade)}

            </span>

            <button class="btn-remover"

                onclick="remover(${item.id})">

                Remover

            </button>
        `;

        lista.appendChild(div);
    });

    const totalItens = carrinho.reduce(
        (soma, item) => soma + item.quantidade, 0
    );

    const subtotal = carrinho.reduce(
        (soma, item) => soma + (item.preco * item.quantidade), 0
    );

    const desconto = subtotal * 0.10;

    const totalFinal = subtotal - desconto;

    document.getElementById('total-itens').textContent = totalItens;

    document.getElementById('total-preco').innerHTML = `
        ${formatarPreco(totalFinal)}

        <br>

        <small style="color:#6eff7a;">
            10% OFF aplicado
        </small>
    `;
}

function alterarQtd(id, delta) {
    const item = carrinho.find(i => i.id === id);

    if (!item) return;
    item.quantidade += delta;
    if (item.quantidade <= 0) {
        remover(id);
    } else {
        salvarCarrinho();
        renderizar();
    }
}

function remover(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    renderizar();
}

function salvarCarrinho() {
    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );
}

function finalizar() {
    if (carrinho.length === 0) {
        alert("Não há produtos no carrinho!");
        return;
    }
    alert("Pedido finalizado com sucesso!");
    carrinho = [];
    salvarCarrinho();
    renderizar();
}

renderizar();