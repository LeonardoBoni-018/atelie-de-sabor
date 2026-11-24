# Ateliê de Sabor — loja de encomendas

Prévia da lojinha online do Ateliê de Sabor (cestas, tortas, bolos e café corporativo), com pedido enviado pelo WhatsApp.
Site estático: `index.html`, `styles.css`, `app.js`, `anim.js` e `products.js`. Não usa build nem backend.

Site publicado: https://atelie-de-sabor.pages.dev

## Editar conteúdo
Tudo fica em `products.js`:
- `CONFIG`: nome, slogan, WhatsApp, cidades de entrega, antecedência, faixa de prévia
- `CATEGORIES`: abas da vitrine
- `PRODUCTS`: produtos, preços, tamanhos, quantidade mínima e fotos (`img/`)
- `CREDITOS_FOTOS`: créditos das fotos de exemplo (Wikimedia Commons); apague ao usar fotos próprias

## Publicar
```bash
npx wrangler pages deploy . --project-name atelie-de-sabor --branch main
```

Site por Leonardo Boni.
