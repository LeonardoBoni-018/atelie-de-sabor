/* Ateliê de Sabor — lógica da loja (vitrine, carrinho, pedido via WhatsApp).
   O conteúdo vem de products.js; aqui não há nada para editar no dia a dia. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (sel) => document.querySelector(sel);
  const CHAVE = "atelie-carrinho-v1";
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const reduzMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Estado ---------- */
  let carrinho = carregar();          // [{ chave, id, tamanho, qtd }]
  let categoriaAtual = CATEGORIES[0].id;
  const tamanhoEscolhido = {};        // id do produto -> nome do tamanho

  function carregar() {
    try {
      const dados = JSON.parse(localStorage.getItem(CHAVE) || "[]");
      return Array.isArray(dados) ? dados.filter((i) => produto(i.id)) : [];
    } catch (e) { return []; }
  }
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(carrinho)); } catch (e) { /* sem storage: segue em memória */ }
  }

  function produto(id) { return PRODUCTS.find((p) => p.id === id); }
  function precoDe(p, tamanho) {
    if (p.tamanhos) {
      const t = p.tamanhos.find((x) => x.nome === tamanho) || p.tamanhos[0];
      return t.preco;
    }
    return p.preco;
  }
  function precoMinimo(p) { return p.tamanhos ? Math.min(...p.tamanhos.map((t) => t.preco)) : p.preco; }

  /* ---------- Textos vindos do CONFIG ---------- */
  function aplicarConfig() {
    document.querySelectorAll('[data-config="nome"]').forEach((el) => (el.textContent = CONFIG.nome));
    document.querySelectorAll('[data-config="slogan"]').forEach((el) => (el.textContent = CONFIG.slogan));
    if (!CONFIG.modoPrevia) $("#previa").remove();
    $("#rodapeAntecedencia").textContent = `Encomendas com ${CONFIG.antecedenciaDias} dias de antecedência`;
    $("#rodapeWhats").href = `https://wa.me/${CONFIG.whatsapp}`;
    $("#rodapeLinks").href = CONFIG.linktree;
    $("#avisoTaxa").textContent = CONFIG.avisoTaxa;

    // Créditos das fotos de exemplo (somem quando a lista estiver vazia)
    const cred = typeof CREDITOS_FOTOS !== "undefined" ? CREDITOS_FOTOS : [];
    $("#creditosFotos").innerHTML = cred.length
      ? "Fotos de exemplo: " + cred.map((c, i) => `<a href="${esc(c.url)}" target="_blank" rel="noopener">${i + 1}</a>`).join(", ") + " (Wikimedia Commons, licenças CC)"
      : "";

    const sel = $("#cidade");
    sel.innerHTML = '<option value="">Selecione</option>' +
      CONFIG.cidadesEntrega.map((c) => `<option>${esc(c)}</option>`).join("");
    if (CONFIG.cidadesEntrega.length === 1) sel.value = CONFIG.cidadesEntrega[0];

    // Data mínima = hoje + antecedência
    const min = new Date();
    min.setDate(min.getDate() + CONFIG.antecedenciaDias);
    const iso = isoLocal(min);
    $("#data").min = iso;
    $("#dicaData").textContent = `Entregas a partir de ${formatarData(iso)} (${CONFIG.antecedenciaDias} dias de antecedência).`;
  }
  function isoLocal(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function formatarData(iso) { const [a, m, d] = iso.split("-"); return `${d}/${m}/${a}`; }
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  /* ---------- Vitrine ---------- */
  function renderAbas() {
    const abas = $("#abas");
    abas.innerHTML = CATEGORIES.map((c) =>
      `<button class="aba" role="tab" id="aba-${c.id}" data-cat="${c.id}" aria-selected="${c.id === categoriaAtual}" tabindex="${c.id === categoriaAtual ? 0 : -1}">${esc(c.nome)}</button>`
    ).join("");
    $("#grade").setAttribute("aria-labelledby", `aba-${categoriaAtual}`);
  }

  function imagemHTML(p, classe) {
    return p.imagem
      ? `<img src="${esc(p.imagem)}" alt="${esc(p.nome)}" loading="lazy">`
      : `<span class="${classe}" role="img" aria-label="${esc(p.nome)}">${p.icone || "🎁"}</span>`;
  }

  function renderGrade() {
    const lista = PRODUCTS.filter((p) => p.categoria === categoriaAtual);
    $("#grade").innerHTML = lista.map((p, i) => {
      const tam = tamanhoEscolhido[p.id] || (p.tamanhos && p.tamanhos[0].nome);
      const preco = p.tamanhos ? precoDe(p, tam) : p.preco;
      return `
      <article class="card" style="--i:${i}">
        <div class="card__foto tom-${p.tom || "vinho"}">
          ${imagemHTML(p, "card__icone")}
          ${p.destaque ? `<span class="selo">${esc(p.destaque)}</span>` : ""}
          ${p.exemplo ? `<span class="selo selo--exemplo">exemplo</span>` : ""}
        </div>
        <div class="card__corpo">
          <h3 class="card__nome">${esc(p.nome)}</h3>
          <p class="card__desc">${esc(p.descricao)}</p>
          <ul class="card__itens" aria-label="Itens inclusos">${p.itens.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          ${p.tamanhos ? `
            <fieldset class="tamanhos"><legend class="sr">Tamanho</legend>
              ${p.tamanhos.map((t) => `<button type="button" class="tamanho" data-id="${p.id}" data-tam="${esc(t.nome)}" aria-pressed="${t.nome === tam}" aria-label="Tamanho ${esc(t.nome)}, ${brl(t.preco)}">${esc(t.nome)}</button>`).join("")}
            </fieldset>` : ""}
          ${p.minimo ? `<p class="minimo">Pedido mínimo: ${p.minimo} pessoas</p>` : ""}
          <div class="card__rodape">
            <span class="preco" data-preco="${p.id}">${brl(preco)}${p.unidade ? ` <small>${esc(p.unidade)}</small>` : ""}</span>
            <button type="button" class="btn-add" data-add="${p.id}" aria-label="Adicionar ${esc(p.nome)} ao carrinho">Adicionar</button>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  function trocarCategoria(id, focar) {
    categoriaAtual = id;
    renderAbas();
    renderGrade();
    if (focar) $(`#aba-${id}`).focus();
  }

  $("#abas").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (b) trocarCategoria(b.dataset.cat);
  });
  // Setas do teclado navegam entre abas
  $("#abas").addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const i = CATEGORIES.findIndex((c) => c.id === categoriaAtual);
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + CATEGORIES.length) % CATEGORIES.length;
    trocarCategoria(CATEGORIES[n].id, true);
  });

  $("#grade").addEventListener("click", (e) => {
    const t = e.target.closest(".tamanho");
    if (t) {
      const p = produto(t.dataset.id);
      tamanhoEscolhido[p.id] = t.dataset.tam;
      t.parentElement.querySelectorAll(".tamanho").forEach((b) => b.setAttribute("aria-pressed", b === t));
      const preco = $(`[data-preco="${p.id}"]`);
      preco.textContent = brl(precoDe(p, t.dataset.tam));
      if (!reduzMovimento) preco.animate([{ opacity: .3, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: "ease-out" });
      return;
    }
    const add = e.target.closest("[data-add]");
    if (add) {
      adicionar(add.dataset.add);
      // Avisa o anim.js (voo da foto até o carrinho, faíscas)
      document.dispatchEvent(new CustomEvent("carrinho:add", { detail: { botao: add, card: add.closest(".card") } }));
      add.textContent = "Adicionado ✓";
      add.classList.add("ok");
      setTimeout(() => { add.textContent = "Adicionar"; add.classList.remove("ok"); }, 1300);
    }
  });

  /* ---------- Carrinho ---------- */
  function adicionar(id) {
    const p = produto(id);
    const tamanho = p.tamanhos ? (tamanhoEscolhido[id] || p.tamanhos[0].nome) : null;
    const chave = tamanho ? `${id}|${tamanho}` : id;
    const item = carrinho.find((i) => i.chave === chave);
    if (item) item.qtd += 1;
    else carrinho.push({ chave, id, tamanho, qtd: p.minimo || 1 });
    salvar();
    renderCarrinho();
    const badge = $("#contador");
    badge.classList.remove("pulsa"); void badge.offsetWidth; badge.classList.add("pulsa");
    toast(p.minimo && !item ? `${p.nome} adicionado (mínimo ${p.minimo})` : `${p.nome} no carrinho`);
  }

  function alterarQtd(chave, delta) {
    const item = carrinho.find((i) => i.chave === chave);
    if (!item) return;
    const min = produto(item.id).minimo || 1;
    item.qtd = Math.max(min, item.qtd + delta);
    salvar(); renderCarrinho();
  }
  function remover(chave) {
    carrinho = carrinho.filter((i) => i.chave !== chave);
    salvar(); renderCarrinho();
  }
  function subtotal() { return carrinho.reduce((s, i) => s + precoDe(produto(i.id), i.tamanho) * i.qtd, 0); }

  function renderCarrinho() {
    const total = carrinho.reduce((s, i) => s + i.qtd, 0);
    $("#contador").textContent = total;
    $("#abrirCarrinho").setAttribute("aria-label", `Abrir carrinho, ${total} ${total === 1 ? "item" : "itens"}`);

    const vazio = carrinho.length === 0;
    $("#vazio").hidden = !vazio;
    $("#subtotalBox").hidden = vazio;
    $("#formPedido").hidden = vazio;

    $("#itensCarrinho").innerHTML = carrinho.map((i) => {
      const p = produto(i.id);
      const unit = precoDe(p, i.tamanho);
      const min = p.minimo || 1;
      return `
      <li class="item">
        <div class="item__mini tom-${p.tom || "vinho"}">${imagemHTML(p, "")}</div>
        <div>
          <div class="item__nome">${esc(p.nome)}</div>
          <div class="item__info">${i.tamanho ? `Tamanho ${esc(i.tamanho)} · ` : ""}${brl(unit)}${p.unidade ? " " + esc(p.unidade) : ""}</div>
          <div class="item__info"><strong>${brl(unit * i.qtd)}</strong>${p.minimo ? ` · mínimo ${p.minimo}` : ""}</div>
        </div>
        <div class="item__acoes">
          <div class="qtd">
            <button type="button" data-menos="${i.chave}" ${i.qtd <= min ? "disabled" : ""} aria-label="Diminuir quantidade de ${esc(p.nome)}">−</button>
            <span aria-live="polite">${i.qtd}</span>
            <button type="button" data-mais="${i.chave}" aria-label="Aumentar quantidade de ${esc(p.nome)}">+</button>
          </div>
          <button type="button" class="remover" data-remover="${i.chave}">Remover</button>
        </div>
      </li>`;
    }).join("");
    $("#subtotal").textContent = brl(subtotal());

    // Barra fixa "Finalizar" (aparece no celular quando há itens)
    $("#barraPedido").hidden = vazio;
    $("#barraQtd").textContent = `${total} ${total === 1 ? "item" : "itens"}`;
    $("#barraTotal").textContent = brl(subtotal());
  }

  $("#itensCarrinho").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.menos) alterarQtd(b.dataset.menos, -1);
    if (b.dataset.mais) alterarQtd(b.dataset.mais, +1);
    if (b.dataset.remover) remover(b.dataset.remover);
  });

  /* ---------- Abrir / fechar gaveta ---------- */
  const gaveta = $("#gaveta"), veu = $("#veu");
  let ultimoFoco = null;
  function abrir() {
    ultimoFoco = document.activeElement;
    veu.hidden = false;
    requestAnimationFrame(() => { veu.classList.add("aberto"); gaveta.classList.add("aberta"); });
    gaveta.setAttribute("aria-hidden", "false");
    document.body.classList.add("travado");
    setTimeout(() => $("#fecharCarrinho").focus(), 50);
  }
  function fechar() {
    veu.classList.remove("aberto");
    gaveta.classList.remove("aberta");
    gaveta.setAttribute("aria-hidden", "true");
    document.body.classList.remove("travado");
    setTimeout(() => { veu.hidden = true; }, 350);
    if (ultimoFoco) ultimoFoco.focus();
  }
  $("#abrirCarrinho").addEventListener("click", abrir);
  $("#barraPedido").addEventListener("click", abrir);
  $("#fecharCarrinho").addEventListener("click", fechar);
  veu.addEventListener("click", fechar);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && gaveta.classList.contains("aberta")) fechar();
    // Mantém o foco dentro da gaveta aberta
    if (e.key === "Tab" && gaveta.classList.contains("aberta")) {
      const focaveis = [...gaveta.querySelectorAll("button, input, select, textarea")].filter((el) => !el.disabled && el.offsetParent);
      const prim = focaveis[0], ult = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === prim) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); prim.focus(); }
    }
  });

  /* ---------- Formulário ---------- */
  const form = $("#formPedido");
  $("#ehPresente").addEventListener("change", (e) => { $("#camposPresente").hidden = !e.target.checked; });

  function marcarErro(campo, msg) {
    campo.classList.add("invalido");
    campo.setAttribute("aria-invalid", "true");
    const label = campo.closest("label");
    if (!label) return;
    const atual = label.querySelector(".msg-erro");
    if (atual) atual.textContent = msg;
    else label.insertAdjacentHTML("beforeend", `<span class="msg-erro">${msg}</span>`);
  }
  function limparErro(campo) {
    campo.classList.remove("invalido");
    campo.removeAttribute("aria-invalid");
    const m = campo.closest("label")?.querySelector(".msg-erro");
    if (m) m.remove();
  }
  form.addEventListener("input", (e) => limparErro(e.target));
  form.addEventListener("change", (e) => limparErro(e.target));

  function validar() {
    let primeiroErro = null;
    const f = form.elements;
    const exigir = (campo, ok, msg) => { if (!ok) { marcarErro(campo, msg); primeiroErro = primeiroErro || campo; } };

    exigir(f.nome, f.nome.value.trim().length >= 2, "Informe seu nome.");
    exigir(f.telefone, f.telefone.value.replace(/\D/g, "").length >= 10, "Telefone com DDD, por favor.");
    exigir(f.cidade, !!f.cidade.value, "Escolha a cidade.");
    exigir(f.bairro, f.bairro.value.trim().length >= 2, "Informe o bairro.");
    exigir(f.endereco, f.endereco.value.trim().length >= 5, "Informe rua e número.");
    if (!f.data.value) exigir(f.data, false, "Escolha a data de entrega.");
    else exigir(f.data, f.data.value >= f.data.min, `A partir de ${formatarData(f.data.min)}.`);
    if (f.presente.checked) exigir(f.destinatario, f.destinatario.value.trim().length >= 2, "Para quem é o presente?");

    // Quantidade mínima (segurança extra)
    const abaixo = carrinho.find((i) => produto(i.id).minimo && i.qtd < produto(i.id).minimo);
    $("#erroGeral").textContent = abaixo ? `${produto(abaixo.id).nome}: mínimo de ${produto(abaixo.id).minimo}.` :
      primeiroErro ? "Confira os campos destacados." : "";
    if (primeiroErro) primeiroErro.focus();
    return !primeiroErro && !abaixo;
  }

  function montarMensagem() {
    const f = form.elements;
    const linhas = [
      `🎁 *Novo pedido — ${CONFIG.nome}*`,
      `*Cliente:* ${f.nome.value.trim()} — ${f.telefone.value.trim()}`,
      `*Itens:*`,
      ...carrinho.map((i) => {
        const p = produto(i.id);
        return `• ${i.qtd}x ${p.nome}${i.tamanho ? ` (Tamanho: ${i.tamanho})` : ""} — ${brl(precoDe(p, i.tamanho) * i.qtd)}`;
      }),
      `*Subtotal:* ${brl(subtotal())}`,
    ];
    if (f.presente.checked) {
      const cartao = f.cartao.value.trim();
      linhas.push(`*Presente para:* ${f.destinatario.value.trim()}${cartao ? ` — *Cartão:* "${cartao}"` : ""}`);
    }
    linhas.push(
      `*Entrega:* ${f.cidade.value} — ${f.bairro.value.trim()} — ${f.endereco.value.trim()}`,
      `*Taxa de entrega:* a confirmar`,
      `*Data:* ${formatarData(f.data.value)} — período da ${f.periodo.value}`
    );
    if (f.obs.value.trim()) linhas.push(`*Obs.:* ${f.obs.value.trim()}`);
    return linhas.join("\n").replace(/ /g, " "); // toLocaleString usa espaço especial
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!carrinho.length || !validar()) return;
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(montarMensagem())}`;
    window.__ultimoLinkWhats = url; // útil para conferir a mensagem
    // Abre já (navegadores bloqueiam pop-up atrasado) e anima o botão
    window.open(url, "_blank", "noopener");
    document.dispatchEvent(new CustomEvent("pedido:enviando"));
  });

  /* ---------- Detalhes vivos ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("mostra");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("mostra"), 2200);
  }

  /* ---------- Início ---------- */
  aplicarConfig();
  renderAbas();
  renderGrade();
  renderCarrinho();
})();
