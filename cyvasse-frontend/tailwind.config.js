/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
      'game-board': "url('/src/assets/Board.png')",
      'aB': "url('/src/assets/units/aB.png')",
      'aCa': "url('/src/assets/units/aCa.png')",
      'aCs': "url('/src/assets/units/aCs.png')",
      'aD': "url('/src/assets/units/aD.png')",
      'aE': "url('/src/assets/units/aE.png')",
      'aH': "url('/src/assets/units/aH.png')",
      'aK': "url('/src/assets/units/aK.png')",
      'aL': "url('/src/assets/units/aL.png')",
      'am': "url('/src/assets/units/am.png')",
      'aS': "url('/src/assets/units/aS.png')",
      'aT': "url('/src/assets/units/aT.png')",
      'oB': "url('/src/assets/units/oB.png')",
      'oCa': "url('/src/assets/units/oCa.png')",
      'oCs': "url('/src/assets/units/oCs.png')",
      'oD': "url('/src/assets/units/oD.png')",
      'oE': "url('/src/assets/units/oE.png')",
      'oH': "url('/src/assets/units/oH.png')",
      'oK': "url('/src/assets/units/oK.png')",
      'oL': "url('/src/assets/units/oL.png')",
      'om': "url('/src/assets/units/om.png')",
      'oS': "url('/src/assets/units/oS.png')",
      'oT': "url('/src/assets/units/oT.png')",
      
    }},
  },
  plugins: [],
}

