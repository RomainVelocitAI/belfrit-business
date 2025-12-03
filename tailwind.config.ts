import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Anciennes couleurs (deprecated - à supprimer après migration complète)
        primary: {
          red: "#FF0025",
          gold: "#FFDB00",
        },
        // Nouvelles couleurs centralisées (charte graphique BelFrit)
        belfrit: {
          red: "#FF0025",
          "red-dark": "#E60022",
          yellow: "#FFDB00",
          "yellow-dark": "#E6C500",
          black: "#000000",
          white: "#FFFFFF",
          camel: "#CD9760",
          shell: "#F4E8DF",
          // Couleurs UI/Utilitaires
          darkBg: "#111111",
          darkCard: "#1e293b",
          darkBlue: "#1E3A8A",
        },
        // Couleurs du drapeau de La Réunion
        reunion: {
          blue: "#0055A4",
          yellow: "#FCD116",
          red: "#CE1126",
        },
      },
      fontFamily: {
        // Polices selon charte graphique
        heading: ["Arial Black", "Arial Bold", "sans-serif"],
        body: ["Roboto", "sans-serif"],
        handwritten: ["Nothing You Could Do", "cursive"],
        // Anciennes polices (conservées pour compatibilité)
        anton: ["Anton", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
