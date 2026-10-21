# TAUFF. — Site oficial

> **Create sights, building web sites.**

Site institucional do estúdio TAUFF. 100% estático (HTML + CSS + JS puro), sem
frameworks e sem etapa de build — pronto para rodar no **GitHub Pages**.

---

## 📁 Estrutura

```
tauff-site/
├── index.html              ← página única (todas as seções)
├── .nojekyll               ← garante que o GitHub Pages sirva tudo como está
└── assets/
    ├── css/style.css       ← estilos (cores da marca: preto #060505 + laranja #FE8B04)
    ├── js/main.js          ← interações (leque, contadores, FAQ, cursor, etc.)
    ├── img/                ← logos, favicons, fotos e prints dos projetos
    └── video/              ← vídeo em loop da seção "Sua empresa perde clientes"
```

## 🚀 Como publicar no GitHub Pages (passo a passo)

1. **Crie um repositório** no GitHub (ex.: `tauff-site`), público ou privado*.
2. Abra o **GitHub Desktop** → `File` → `Add Local Repository` → selecione a
   pasta `tauff-site` (se ele perguntar, escolha criar um repositório ali mesmo).
3. Escreva uma mensagem tipo `primeira versão do site` e clique em
   **Commit to main**.
4. Clique em **Publish repository** (botão no topo). Pronto, o código subiu.
5. No site do GitHub, entre no repositório → `Settings` → `Pages`
   (menu lateral) → em **Build and deployment**:
   - `Source`: **Deploy from a branch**
   - `Branch`: **main** / pasta **/(root)**
   - Clique em **Save**.
6. Aguarde ~1 minuto. O site estará no ar em:
   `https://SEU-USUARIO.github.io/tauff-site/`

> \* Repositórios privados exigem GitHub Pro para ativar o Pages. Com conta
> gratuita, use repositório público.

## 🔁 Para atualizar depois

Edite os arquivos (textos ficam todos no `index.html`), abra o GitHub Desktop,
escreva a mensagem do commit → **Commit to main** → **Push origin**. O Pages
atualiza sozinho em ~1 minuto.

## ✏️ O que personalizar quando quiser

| Onde | O quê |
|------|-------|
| `index.html` | Todos os textos, descrições dos projetos, perguntas do FAQ |
| `index.html` (busca por `wa.me/5511932824884`) | Mensagem automática do WhatsApp |
| `assets/img/` | Logos, fotos e screenshots |
| `assets/css/style.css` (linhas 1–20) | Cores e fontes da marca |

## 🧩 Seções do site (seguem o esqueleto combinado)

1. **Hero** — apresentação da TAUFF + copy de contato direto
2. **Estatísticas** — números de conversão de empresas com site × sem site
3. **Sobre** — introdução com texto + canais de contato
4. **Leque de projetos** — os 5 sites criados, com foto, descrição e link
5. **Vídeo + "Sua empresa perde clientes quando não é encontrada"**
6. **FAQ** — dúvidas frequentes sobre sites
7. **Rodapé** — contato + copy + logo completa em fundo transparente

## 🛠️ Testado e validado

- ✅ Chrome/Firefox desktop (1440px) e mobile (390px)
- ✅ Caminhos relativos (funciona em qualquer subpasta do GitHub Pages)
- ✅ Sem dependências externas além do Google Fonts
- ✅ Vídeo otimizado (loop silencioso de 15s, ~370KB)
- ✅ Acessibilidade: navegação por teclado, ARIA e `prefers-reduced-motion`

---

© 2026 TAUFF. Todos os direitos reservados.
