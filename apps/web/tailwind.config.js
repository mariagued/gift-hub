/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./apps/web/src/**/*.{html,ts}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: [
            {
                meutema: {
                    "primary": "#6366f1", // Sua Cor Primária (Indigo)
                    "secondary": "#ec4899", // Sua Cor Secundária (Pink)
                    "--rounded-btn": "1.9rem", // O Shape (Arredondamento tipo pílula)
                },
            },
        ],
    },
}