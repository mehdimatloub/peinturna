import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx,css}", // Si tu utilises le dossier "app"
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Si tu utilises le dossier "pages"
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Pour les composants
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Variables CSS pour la gestion des couleurs
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;
