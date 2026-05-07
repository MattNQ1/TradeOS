// Tailwind v4 plugs into PostCSS via @tailwindcss/postcss.
// No tailwind.config.ts needed — theme is configured in CSS via @theme {}.
const config = {
    plugins: { "@tailwindcss/postcss": {} },
};

export default config;
