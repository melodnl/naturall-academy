# Page Topology — therecipespremium.online/cosmetics/

**Stack origem:** WordPress + Elementor (theme: Twenty Twenty Five). Carrossel via Swiper.js. Acordeão via Elementor Toggle widget. Sem Lenis/Locomotive — `scroll-behavior: smooth` nativo no `<html>`.

**Page height:** 8091px (desktop 1440px). Conteúdo é uma única coluna centralizada, sem nav fixa/sticky, sem header, sem footer estruturado (apenas um `<p>` de texto legal).

## Ordem das seções (top → bottom)

| # | Nome (working) | Bg | Altura ~ | Modelo de interação |
|---|---|---|---|---|
| 1 | Hero (gradient) | `linear-gradient(190deg, #000 20%, #00EC05 100%)` | 1204px | static |
| 2 | Price Box | branco | 328px | static + CTA |
| 3 | Recipes List + Why-Cards | branco | 1362px | static |
| 4 | "YOU WILL ALSO RECEIVE..." banner | preto | 80px | static |
| 5 | Bonuses (2 cards) | branco | 1029px | static + CTA |
| 6 | Testimonials banner | preto | 488px | static |
| 7 | Carousel + Pricing (Basic vs Mega Combo) | preto | 2362px | time-driven (autoplay carousel) + static cards |
| 8 | 7-day Guarantee | branco | 528px | static |
| 9 | FAQ (gradient) | `linear-gradient(0deg, #00FF70 0%, #000 76%)` | 418px | click-driven (accordion) |
| 10 | Footer | `#2B2B2B` | 131px | static |

## Layout global

- Container Elementor centralizado, max-width das `.elementor-section-boxed` em ~1140px.
- Sem sidebar, sem nav fixa, sem header.
- Page flow vertical natural, sem scroll-snap, sem parallax.
- Smooth scroll nativo (`scroll-behavior: smooth`) — usado nas âncoras `#COMPR`.
- Mobile (390px): tudo empilha em coluna única; cards e bônus ficam stacked.

## Dependências entre seções

- Múltiplos botões CTA `I WANT MY RECIPES NOW` apontam para `#COMPR` (âncora do bloco de pricing — seção 7).
- Hero, Recipes, Bonuses repetem o mesmo CTA verde (`#24A900`).
- Pricing (seção 7) tem dois cards: Basic Plan ($4.90) → link Hotmart upgrade, Mega Combo ($6.90) → link Hotmart pay.

## Notas de implementação

- Página é um sales/landing page WordPress comum; tudo em uma rota `/`.
- Sem comportamento dinâmico além de: carousel autoplay (5s, infinite, speed 500ms) e accordion toggle.
- Z-index plano (não há overlays).
- Imagens originais são quase todas square 1024x1024 (carousel + hero) e 300x300 (bônus).
