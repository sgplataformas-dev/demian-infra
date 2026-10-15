// Config local vazio, proposital: este projeto usa Tailwind v4 via
// @tailwindcss/vite (transform nativo do Vite, sem passar por PostCSS).
// Sem este arquivo aqui, o Vite sobe os diretorios e acha o
// postcss.config.js do repo pai (C:\Users\DW1\Desktop\dash-sg), que registra
// tailwindcss v3 como plugin PostCSS e quebra o build (v3 nao entende a
// sintaxe v4 de src/styles.css). Este arquivo local, sem plugins, blinda
// contra isso.
export default {
  plugins: {},
};
