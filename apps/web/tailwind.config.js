/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'global': '20px',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        gifthub: {
          "primary": "#630ed4",          // Violeta do documento
          "primary-content": "#ffffff",
          "secondary": "#7c3aed",        // Primary Container (para o gradiente)
          "accent": "#eaddff",           // Primary Fixed (destaques sutis)
          "neutral": "#191c1e",          // On Surface
          "base-100": "#f7f9fb",         // Surface (Fundo principal)
          "base-200": "#f2f4f6",         // Surface Container Low (Seções)
          "base-300": "#ffffff",         // Surface Container Lowest (Cards)
          
          // Configurações de Shape (Bordas) baseadas no documento
          "--rounded-box": "1.5rem",     // rounded-2xl para cards
          "--rounded-btn": "9999px",     // rounded-full (pílula) para botões
        },
      },
    ],
  },
}