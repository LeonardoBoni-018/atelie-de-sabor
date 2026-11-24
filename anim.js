/* Ateliê de Sabor — animações de Natal.
   Tudo aqui é enfeite: se este arquivo ou o GSAP não carregar, a loja funciona igual.
   Quem pede "reduzir movimento" no celular recebe a página parada. */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temGsap = typeof window.gsap !== "undefined";

  /* ---------- Contagem regressiva até o Natal ---------- */
  function contagem() {
    const el = $("#contagem");
    const hoje = new Date();
    let natal = new Date(hoje.getFullYear(), 11, 25);
    if (hoje > new Date(hoje.getFullYear(), 11, 25, 23, 59)) natal = new Date(hoje.getFullYear() + 1, 11, 25);
    const dias = Math.ceil((natal - new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) / 864e5);
    el.innerHTML = dias === 0
      ? `<strong>Feliz Natal!</strong>`
      : `<strong data-num="${dias}">${dias}</strong><span>${dias === 1 ? "dia" : "dias"} para o Natal</span>`;
  }

  /* ---------- Varal de luzinhas ---------- */
  function luzes() {
    const box = $("#luzes");
    const qtd = Math.round(Math.min(innerWidth, 1400) / 46);
    const cores = ["ouro", "vinho-claro", "oliva-claro", "creme"];
    let html = `<svg viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 1 Q 12.5 9 25 1 T 50 1 T 75 1 T 100 1"/></svg>`;
    for (let i = 0; i < qtd; i++) {
      const x = (i + 0.5) / qtd;
      // acompanha a curva do fio (4 ondas)
      const y = Math.abs(Math.sin(x * Math.PI * 4)) * 22 + 4;
      html += `<i class="luz luz--${cores[i % cores.length]}" style="left:${(x * 100).toFixed(2)}%;top:${y.toFixed(1)}px;animation-delay:${(Math.random() * 2.4).toFixed(2)}s"></i>`;
    }
    box.innerHTML = html;
  }

  /* ---------- Neve em canvas (leve, pausa fora da tela) ---------- */
  function neve() {
    const cv = $("#neve");
    const ctx = cv.getContext("2d");
    let flocos = [], ativo = true, w, h, dpr;
    function tamanho() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const qtd = Math.round(w / (innerWidth < 640 ? 9 : 14));
      flocos = Array.from({ length: qtd }, () => novo(true));
    }
    function novo(qualquerAltura) {
      return { x: Math.random() * w, y: qualquerAltura ? Math.random() * h : -6, r: 0.8 + Math.random() * 2.6,
        v: 0.3 + Math.random() * 0.8, f: Math.random() * Math.PI * 2, a: 0.35 + Math.random() * 0.55 };
    }
    function quadro() {
      if (!ativo) return;
      ctx.clearRect(0, 0, w, h);
      for (const f of flocos) {
        f.f += 0.012; f.y += f.v; f.x += Math.sin(f.f) * 0.35;
        if (f.y > h + 6) Object.assign(f, novo(false));
        ctx.globalAlpha = f.a;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fillStyle = "#fbf6ec"; ctx.fill();
      }
      requestAnimationFrame(quadro);
    }
    tamanho(); quadro();
    addEventListener("resize", tamanho);
    new IntersectionObserver(([e]) => { const era = ativo; ativo = e.isIntersecting; if (ativo && !era) quadro(); }).observe(cv);
  }

  /* ---------- Faíscas douradas ao adicionar ---------- */
  function faiscas(x, y) {
    const cores = ["#c9a24a", "#ecd9a3", "#7a2632", "#6b7a3d"];
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("i");
      s.className = "faisca";
      s.style.cssText = `left:${x}px;top:${y}px;background:${cores[i % 4]}`;
      document.body.appendChild(s);
      const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const dist = 40 + Math.random() * 50;
      s.animate([
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) scale(0)`, opacity: 0 },
      ], { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => s.remove();
    }
  }

  /* ---------- Foto voa até o carrinho ---------- */
  function voarParaCarrinho(card) {
    const img = card && card.querySelector(".card__foto img");
    const alvo = $("#barraPedido:not([hidden])") && innerWidth < 640 ? $("#barraPedido") : $("#abrirCarrinho");
    if (!img || !alvo) return;
    const de = img.getBoundingClientRect(), para = alvo.getBoundingClientRect();
    const clone = img.cloneNode();
    clone.className = "voando";
    clone.style.cssText = `left:${de.left}px;top:${de.top}px;width:${de.width}px;height:${de.height}px`;
    document.body.appendChild(clone);
    const dx = para.left + para.width / 2 - (de.left + de.width / 2);
    const dy = para.top + para.height / 2 - (de.top + de.height / 2);
    clone.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1, borderRadius: "18px" },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(.45) rotate(-8deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.08) rotate(10deg)`, opacity: 0.2, borderRadius: "50%" },
    ], { duration: 850, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => {
      clone.remove();
      alvo.animate([{ transform: "scale(1)" }, { transform: "scale(1.12) rotate(-3deg)" }, { transform: "scale(1)" }], { duration: 380, easing: "ease-out" });
    };
  }

  document.addEventListener("carrinho:add", (e) => {
    if (reduz) return;
    const r = e.detail.botao.getBoundingClientRect();
    faiscas(r.left + r.width / 2, r.top + r.height / 2);
    voarParaCarrinho(e.detail.card);
  });

  /* ---------- Carrinho: itens entram em cascata ao abrir ---------- */
  const gaveta = $("#gaveta");
  new MutationObserver(() => {
    if (reduz || !gaveta.classList.contains("aberta")) return;
    const alvos = gaveta.querySelectorAll(".item, .subtotal, .form fieldset, .form > label, .btn--whats, .vazio:not([hidden])");
    alvos.forEach((el, i) => el.animate(
      [{ opacity: 0, transform: "translateX(40px)" }, { opacity: 1, transform: "none" }],
      { duration: 500, delay: 120 + i * 45, easing: "cubic-bezier(.22,.8,.24,1)", fill: "backwards" }));
    const icone = $("#abrirCarrinho svg");
    icone && icone.animate([{ transform: "rotate(0)" }, { transform: "rotate(-14deg)" }, { transform: "rotate(10deg)" }, { transform: "rotate(0)" }], { duration: 450 });
  }).observe(gaveta, { attributes: true, attributeFilter: ["class"] });

  /* ---------- Envio pelo WhatsApp: botão vira "embrulhando" e solta confete ---------- */
  document.addEventListener("pedido:enviando", (e) => {
    const btn = $(".btn--whats");
    btn.classList.add("enviando");
    if (!reduz) {
      const r = btn.getBoundingClientRect();
      setTimeout(() => {
        faiscas(r.left + r.width / 2, r.top + r.height / 2);
        faiscas(r.left + r.width * 0.25, r.top);
        faiscas(r.left + r.width * 0.75, r.top);
      }, 500);
    }
    setTimeout(() => btn.classList.replace("enviando", "enviado"), 900);
    setTimeout(() => btn.classList.remove("enviado"), 3200);
  });

  /* ---------- Cards inclinam com o mouse (só desktop) ---------- */
  function inclinar() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const grade = $("#grade");
    grade.addEventListener("pointermove", (e) => {
      const c = e.target.closest(".card"); if (!c) return;
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      c.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
      c.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
      c.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(0)}%`);
      c.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(0)}%`);
    });
    grade.addEventListener("pointerout", (e) => {
      const c = e.target.closest(".card");
      if (c && !c.contains(e.relatedTarget)) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); }
    });
  }

  /* ---------- Coreografia com GSAP ---------- */
  function coreografia() {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("gsap-on");

    // Título entra palavra por palavra
    const titulo = $(".hero__titulo");
    titulo.innerHTML = titulo.textContent.trim().split(/\s+/)
      .map((p) => `<span class="palavra"><span>${p}</span></span>`).join(" ");

    // fromTo com estado final explícito: nada fica escondido se a entrada for interrompida
    const sobe = (y) => [{ y, autoAlpha: 0 }, { y: 0, autoAlpha: 1, clearProps: "transform,opacity,visibility" }];
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero__selo", sobe(20)[0], { ...sobe(20)[1], duration: 0.7 })
      .fromTo(".palavra > span", { yPercent: 110, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.07 }, "-=0.35")
      .fromTo(".hero__texto", sobe(18)[0], { ...sobe(18)[1], duration: 0.7 }, "-=0.5")
      .fromTo(".moldura", { clipPath: "inset(100% 0% 0% 0% round 999px 999px 24px 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 24px 24px)", duration: 1.2, ease: "expo.out" }, 0.2)
      .fromTo(".moldura img", { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0.2)
      .fromTo(".enfeite", { y: -140, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.15, ease: "bounce.out", clearProps: "transform" }, 0.7)
      .fromTo(".estrela", { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 0.9, ease: "back.out(2)", clearProps: "transform" }, 1)
      .fromTo(".luz", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: { each: 0.03, from: "center" }, clearProps: "transform" }, 0.4);

    // Número da contagem sobe de 0 até o valor
    const num = $("#contagem [data-num]");
    if (num) {
      const alvo = { v: 0 };
      tl.to(alvo, { v: +num.dataset.num, duration: 1.4, ease: "power2.out", onUpdate: () => (num.textContent = Math.round(alvo.v)) }, 0.9);
    }

    // Parallax suave da foto e do texto ao rolar
    gsap.to(".moldura img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__conteudo", { y: 60, autoAlpha: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "center top+=30%", end: "bottom top", scrub: true } });

    // Títulos de seção
    gsap.utils.toArray(".secao-titulo").forEach((t) =>
      gsap.from(t, { y: 30, autoAlpha: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: t, start: "top 88%" } }));

    // Abas entram em cascata
    gsap.from(".aba", { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: "#abas", start: "top 90%" } });

    // "Como funciona": linha dourada se desenha com a rolagem, passos aparecem
    const linha = $(".como__linha path");
    if (linha) {
      const L = linha.getTotalLength();
      gsap.set(linha, { strokeDasharray: L, strokeDashoffset: L });
      gsap.to(linha, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".como", start: "top 80%", end: "center 55%", scrub: 0.6 } });
    }
    ScrollTrigger.batch(".como__grade > div", {
      start: "top 85%", once: true,
      onEnter: (els) => gsap.from(els, { y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }),
    });
    gsap.from(".como__num", { scale: 0, rotate: -90, duration: 0.7, stagger: 0.15, ease: "back.out(2.2)", scrollTrigger: { trigger: ".como__grade", start: "top 80%" } });

    // Faixa acelera conforme a velocidade da rolagem
    const trilho = $(".faixa__trilho");
    if (trilho) {
      const anim = trilho.getAnimations()[0];
      ScrollTrigger.create({
        onUpdate: (self) => {
          if (!anim) return;
          anim.playbackRate = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 5);
          gsap.delayedCall(0.25, () => (anim.playbackRate = 1));
        },
      });
    }

    addEventListener("load", () => ScrollTrigger.refresh());
  }

  /* ---------- Início ---------- */
  contagem();
  luzes();
  if (reduz) return;
  neve();
  inclinar();
  if (temGsap && window.ScrollTrigger) coreografia();
})();
