/* =====================================================================
   ATELIÊ DE SABOR — CONTEÚDO EDITÁVEL
   Tudo o que muda na loja fica aqui: dados da loja (CONFIG) e
   produtos (PRODUCTS). Não é preciso mexer em app.js nem em styles.css.
   ===================================================================== */

const CONFIG = {
  nome: "Ateliê de Sabor",
  slogan: "Uma nova experiência de presente!",

  // WhatsApp que recebe os pedidos: DDI + DDD + número, só dígitos.
  whatsapp: "5512988997976",

  // Somente entrega (não há retirada).
  modo: "entrega",

  // Cidades atendidas — ainda a confirmar. Acrescente ou remova itens.
  cidadesEntrega: ["São José dos Campos"],

  // Dias mínimos entre hoje e a data de entrega.
  antecedenciaDias: 2,

  // Aviso exibido no carrinho.
  avisoTaxa: "A taxa de entrega será confirmada pelo WhatsApp.",

  // Página de links atual (referência).
  linktree: "https://linktr.ee/ateliedesabor1",

  // true mostra a faixa "Prévia — demonstração para aprovação".
  modoPrevia: true,
};

/* Categorias (ordem das abas). "id" liga a categoria aos produtos. */
const CATEGORIES = [
  { id: "natal", nome: "Natal" },
  { id: "cestas", nome: "Cestas" },
  { id: "tortas", nome: "Tortas e bolos" },
  { id: "corporativo", nome: "Café corporativo" },
];

/* Créditos das fotos de exemplo (Wikimedia Commons). Ao trocar pelas fotos
   da loja, apague a linha correspondente — ou esvazie a lista toda. */
const CREDITOS_FOTOS = [
  { autor: "Münger", url: "https://commons.wikimedia.org/wiki/File:Geschenkverpackung_Panettone_(M%C3%BCnger_2018).jpg", licenca: "CC BY-SA 4.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Christmas_Eve_dinner_table_with_Christmas_food_01.jpg", licenca: "CC BY-SA 4.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Christmas_cookies_%26_decoration.jpg", licenca: "CC BY-SA 2.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Panettone_italiano._Pan_dulce_de_Navidad.jpg", licenca: "CC BY 4.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Breakfast_at_a_cafe_with_croissant_and_jam_in_the_morning.jpg", licenca: "CC BY 2.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Chocolate_%26_Rose_Gift_Basket.jpg", licenca: "CC BY-SA 4.0" },
  { autor: "Bread Fairy", url: "https://commons.wikimedia.org/wiki/File:Bread_Fairy_-_Lemon_Meringue_Pie_02.jpg", licenca: "CC BY 2.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Chocolate_cake_with_ganache_frosting.jpg", licenca: "CC BY 2.0" },
  { autor: "Andy Li", url: "https://commons.wikimedia.org/wiki/File:Almond_croissant_-_Workshop_Coffee_Lab_2025-06-27.jpg", licenca: "CC0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Christmas_cookies_with_rolling_pin_closeup.jpg", licenca: "CC BY 2.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Panettone_-_Nicolettone_2017_-_IMG_7085_(31752542285).jpg", licenca: "CC BY 2.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Stollen_tradicional,_pan_dulce_alem%C3%A1n_de_Navidad_hecho_en_Capiov%C3%AD,_Misiones,_Argentina.jpg", licenca: "CC BY-SA 3.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Chocolate_covered_gingerbread_cookies_02.jpg", licenca: "CC BY-SA 4.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Des_macarons_de_chez_Bouillet_(mars_2023).jpg", licenca: "CC0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Scones_Jam_Cream.jpg", licenca: "CC BY-SA 2.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Strawberry_tart,_2015-06-06.jpg", licenca: "CC BY-SA 4.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Red_Velvet_Cake_Waldorf_Astoria.jpg", licenca: "CC BY-SA 3.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Brunch_Kalaset.jpg", licenca: "CC BY-SA 2.0" },
  { autor: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Brownie.jpg", licenca: "Domínio público" },
];

/* ---------------------------------------------------------------------
   PRODUTOS
   Campos:
     id         identificador único (sem espaços)
     categoria  id de uma categoria acima
     nome, descricao
     itens      lista curta do que vem (aparece no card)
     preco      preço base em reais (número)
     tamanhos   opcional: [{ nome: "P", preco: 59 }, ...] substitui o preço
     minimo     opcional: quantidade mínima (ex.: café corporativo)
     unidade    opcional: texto após o preço (ex.: "por pessoa")
     imagem     caminho em /img (ex.: "img/cesta-noite-feliz.jpg").
                Sem imagem, aparece o placeholder com "icone" e "tom".
     icone      emoji do placeholder
     tom        cor do placeholder: "vinho" | "oliva" | "dourado"
     destaque   opcional: selo curto no card
     exemplo    true = produto de exemplo, substituir pelo real
   --------------------------------------------------------------------- */
const PRODUCTS = [
  // ---------- NATAL ----------
  {
    id: "cesta-noite-feliz", imagem: "img/cesta-noite-feliz.jpg", categoria: "natal", exemplo: true,
    nome: "Cesta Noite Feliz",
    descricao: "A cesta completa para presentear quem você ama no Natal.",
    itens: ["Panetone artesanal 500g", "Vinho tinto suave", "Geleia de frutas vermelhas", "Cookies natalinos", "Chocolates finos"],
    preco: 289.9, icone: "🎄", tom: "vinho", destaque: "Mais pedida",
  },
  {
    id: "cesta-ceia-especial", imagem: "img/cesta-ceia-especial.jpg", categoria: "natal", exemplo: true,
    nome: "Cesta Ceia Especial",
    descricao: "Para a mesa da ceia: frios, pães e um bom espumante.",
    itens: ["Espumante brut", "Queijos e salame", "Pão de fermentação natural", "Castanhas e damascos", "Torta natalina mini"],
    preco: 379.9, icone: "🥂", tom: "oliva",
  },
  {
    id: "mini-cesta-presente", imagem: "img/mini-cesta-presente.jpg", categoria: "natal", exemplo: true,
    nome: "Mini Cesta Presente",
    descricao: "Um carinho pequeno para colegas, amigos secretos e vizinhos.",
    itens: ["Mini panetone", "Biscoitos amanteigados", "Bombons artesanais", "Cartão personalizado"],
    preco: 119.9, icone: "🎁", tom: "dourado",
  },
  {
    id: "torta-natalina", imagem: "img/panettone.jpg", categoria: "natal", exemplo: true,
    nome: "Panetone Recheado de Pistache",
    descricao: "Massa de longa fermentação com recheio cremoso de pistache.",
    itens: ["800g", "Embalagem presente", "Validade de 15 dias"],
    preco: 129.9, icone: "⭐", tom: "vinho",
  },  {
    id: "kit-panetone-vinho", imagem: "img/kit-panetone-vinho.jpg", categoria: "natal", exemplo: true,
    nome: "Kit Panetone & Vinho",
    descricao: "Dupla clássica para brindar o Natal em casa ou presentear.",
    itens: ["Panetone de frutas 750g", "Vinho tinto seco", "Caixa kraft com laço"],
    preco: 159.9, icone: "🍷", tom: "vinho",
  },
  {
    id: "stollen", imagem: "img/stollen.jpg", categoria: "natal", exemplo: true,
    nome: "Stollen Natalino",
    descricao: "Pão doce alemão com frutas secas, amêndoas e açúcar de confeiteiro.",
    itens: ["600g", "Receita tradicional", "Embalagem presente"],
    preco: 89.9, icone: "🍞", tom: "dourado", destaque: "Novidade",
  },
  {
    id: "biscoitos-natal", imagem: "img/biscoitos-natal.jpg", categoria: "natal", exemplo: true,
    nome: "Lata de Biscoitos Natalinos",
    descricao: "Biscoitos de gengibre cobertos com chocolate, numa lata decorada.",
    itens: ["20 biscoitos", "Gengibre e canela", "Lata reutilizável"],
    preco: 69.9, icone: "🍪", tom: "oliva",
  },


  // ---------- CESTAS ----------
  {
    id: "cesta-cafe-manha", imagem: "img/cesta-cafe-manha.jpg", categoria: "cestas", exemplo: true,
    nome: "Cesta Café da Manhã",
    descricao: "Um café da manhã de hotel entregue na porta.",
    itens: ["Pães e croissants", "Frutas frescas", "Suco natural", "Bolo caseiro", "Café especial"],
    preco: 189.9, icone: "☕", tom: "dourado",
  },
  {
    id: "cesta-presente", imagem: "img/cesta-presente.jpg", categoria: "cestas", exemplo: true,
    nome: "Cesta Presente Afeto",
    descricao: "Doces artesanais e um mimo para datas especiais.",
    itens: ["Brownies", "Brigadeiros gourmet", "Caneca decorada", "Flores secas"],
    preco: 159.9, icone: "💐", tom: "vinho",
  },  {
    id: "cesta-romantica", imagem: "img/cesta-romantica.jpg", categoria: "cestas", exemplo: true,
    nome: "Caixa de Macarons",
    descricao: "Macarons coloridos em caixa de presente, sabores sortidos.",
    itens: ["12 macarons", "6 sabores", "Fita de cetim"],
    preco: 89.9, icone: "💝", tom: "vinho",
  },
  {
    id: "cesta-cha-tarde", imagem: "img/cesta-cha-tarde.jpg", categoria: "cestas", exemplo: true,
    nome: "Cesta Chá da Tarde",
    descricao: "Scones quentinhos, geleia e creme para um chá especial.",
    itens: ["6 scones", "Geleia de morango", "Creme batido", "Chás selecionados"],
    preco: 139.9, icone: "🫖", tom: "dourado",
  },


  // ---------- TORTAS E BOLOS ----------
  {
    id: "torta-limao", imagem: "img/torta-limao.jpg", categoria: "tortas", exemplo: true,
    nome: "Torta de Limão",
    descricao: "Massa amanteigada, creme de limão siciliano e merengue maçaricado.",
    itens: ["P serve 8", "M serve 15", "G serve 25"],
    tamanhos: [{ nome: "P", preco: 79.9 }, { nome: "M", preco: 129.9 }, { nome: "G", preco: 189.9 }],
    icone: "🍋", tom: "oliva",
  },
  {
    id: "bolo-chocolate", imagem: "img/bolo-chocolate.jpg", categoria: "tortas", exemplo: true,
    nome: "Bolo Trufado de Chocolate",
    descricao: "Massa de cacau, recheio trufado e cobertura de ganache.",
    itens: ["P serve 10", "M serve 20", "G serve 30"],
    tamanhos: [{ nome: "P", preco: 99.9 }, { nome: "M", preco: 159.9 }, { nome: "G", preco: 229.9 }],
    icone: "🍫", tom: "vinho",
  },  {
    id: "torta-morango", imagem: "img/torta-morango.jpg", categoria: "tortas", exemplo: true,
    nome: "Torta de Morango",
    descricao: "Creme de baunilha e morangos frescos sobre massa crocante.",
    itens: ["P serve 8", "M serve 15", "G serve 25"],
    tamanhos: [{ nome: "P", preco: 89.9 }, { nome: "M", preco: 139.9 }, { nome: "G", preco: 199.9 }],
    icone: "🍓", tom: "vinho",
  },
  {
    id: "bolo-red-velvet", imagem: "img/bolo-red-velvet.jpg", categoria: "tortas", exemplo: true,
    nome: "Bolo Red Velvet",
    descricao: "Massa aveludada vermelha com cobertura de cream cheese.",
    itens: ["P serve 10", "M serve 20", "G serve 30"],
    tamanhos: [{ nome: "P", preco: 109.9 }, { nome: "M", preco: 169.9 }, { nome: "G", preco: 239.9 }],
    icone: "🎂", tom: "vinho",
  },


  // ---------- CAFÉ CORPORATIVO ----------
  {
    id: "kit-cafe-corporativo", imagem: "img/cafe-corporativo.jpg", categoria: "corporativo", exemplo: true,
    nome: "Kit Café Corporativo",
    descricao: "Coffee break para reuniões e eventos, montado e entregue.",
    itens: ["Mini salgados", "Mini doces", "Pães de queijo", "Café e sucos", "Descartáveis inclusos"],
    preco: 34.9, unidade: "por pessoa", minimo: 10, icone: "🥐", tom: "oliva",
  },  {
    id: "kit-brunch", imagem: "img/kit-brunch.jpg", categoria: "corporativo", exemplo: true,
    nome: "Kit Brunch Executivo",
    descricao: "Brunch completo para reuniões longas e confraternizações.",
    itens: ["Sanduíches naturais", "Quiches", "Frutas", "Bolos", "Café, chá e sucos"],
    preco: 54.9, unidade: "por pessoa", minimo: 15, icone: "🥗", tom: "oliva",
  },
  {
    id: "mimo-corporativo", imagem: "img/mimo-corporativo.jpg", categoria: "corporativo", exemplo: true,
    nome: "Mimo Corporativo de Natal",
    descricao: "Caixinha com brownie e cartão com a marca da empresa para a equipe.",
    itens: ["Brownie artesanal", "Cartão personalizado", "Embalagem com logo"],
    preco: 24.9, unidade: "por unidade", minimo: 20, icone: "🎁", tom: "dourado",
  },

];
