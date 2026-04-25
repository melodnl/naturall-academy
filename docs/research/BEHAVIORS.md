# Behaviors — therecipespremium.online/cosmetics/

## Resumo
Página estática WordPress/Elementor. Não tem header sticky, não tem scroll-driven animations, não tem parallax, não tem smooth scroll lib (Lenis/Locomotive). Apenas dois comportamentos dinâmicos: o carrossel de depoimentos (autoplay) e o accordion de FAQ (click).

## Scroll sweep
- Header: NÃO HÁ. Página começa direto no hero.
- Animações de entrada: nenhuma detectada. Elementos aparecem estáticos no DOM no load.
- Sticky/sidebar: nenhum.
- Scroll-snap: `scroll-snap-type: none`.
- Smooth scroll lib: nenhuma. `<html>` tem `scroll-behavior: smooth` nativo, usado para âncoras `#COMPR`.

## Click sweep
- **CTA `I WANT MY RECIPES NOW`** (5 botões repetidos): href `#COMPR` → smooth scroll para o bloco de pricing.
- **CTA `I WANT TO START NOW`** (Basic Plan): link externo Hotmart upgrade.
- **CTA `YES, I WANT THIS SUPER OFFER!`** (Mega Combo): link externo Hotmart pay.
- **FAQ accordion**: 3 itens (`Do I need to pay any monthly amount?`, `How will I receive access?`, `What is the value of the material?`). Click no título alterna `display:none/block` no `.elementor-tab-content` e troca ícone `fa-caret-right` ↔ `fa-caret-up`. Estado inicial: todos fechados.
- **Carousel arrows** (`Slide anterior`, `Próximo slide`): controles do Swiper.
- **Carousel dots** (`Ir para o slide N`): paginação Swiper, 18 slides.

## Hover sweep
- CTAs verdes têm `transition: 0.3s` declarado mas hover state visual padrão Elementor (leve mudança de bg/opacity). Vou tratar como `hover:opacity-90` ou `hover:brightness-110`.
- Cards de plano e bônus: sem hover state significativo.
- Links do FAQ: cor padrão herda.

## Carousel (Swiper) — config extraída
```json
{
  "navigation": "both",
  "autoplay": "yes",
  "pause_on_hover": "yes",
  "pause_on_interaction": "yes",
  "autoplay_speed": 5000,
  "infinite": "yes",
  "speed": 500
}
```
- 18 slides, imagens `1.png`–`18.png` (1024×1024) → exibidas a 310×310px, 3 por viewport no desktop.
- Setas: ícones Elementor `eicon-chevron-left/right`.
- Dots: 18 botões abaixo do carrossel.
- **Implementação:** vou usar `embla-carousel-react` (mais leve que Swiper) com autoplay + dots + arrows.

## Responsive sweep
- **Desktop 1440px**: layout single-column, sections com max-width ~1140px centralizadas.
- **Tablet 768px**: cards Why (4 colunas) viram 2 colunas; planos lado-a-lado viram empilhados; carousel mostra 2 slides.
- **Mobile 390px**: tudo single-column. Hero image scale-down. Carousel mostra 1 slide. CTAs full-width com padding reduzido. Fonts diminuem (h1 60px → ~36px observado).

## Tokens globais
- **Verde CTA**: `#24A900` (rgb(36,169,0))
- **Verde gradient hero**: `#00EC05`
- **Verde gradient FAQ**: `#00FF70`
- **Verde Mega CTA**: gradient `#59D265 → #369840`
- **Preto**: `#000000`
- **Cinza footer**: `#2B2B2B`
- **Branco**: `#FFFFFF`
- **Texto body**: `#111111`
- **Body font**: Manrope (22px base)
- **Heading font**: Poppins (h1 60px/800)
- **Outras fonts carregadas**: Roboto, Roboto Slab, Montserrat (Mega CTA usa Montserrat)
- **Border-radius padrão CTA**: 5px (verde) / 35px (Mega)
- **Box-shadow CTA verde**: `0 0 10px rgba(255,255,255,.5)` (white glow on dark bg)
- **Transition padrão**: `0.3s`
