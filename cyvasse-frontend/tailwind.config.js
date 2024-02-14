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
      'aR': "url('/src/assets/units/aR.png')",
      'aC': "url('/src/assets/units/aC.png')",
      'aF': "url('/src/assets/units/aF.png')",
      'aD': "url('/src/assets/units/aD.png')",
      'aE': "url('/src/assets/units/aE.png')",
      'aH': "url('/src/assets/units/aH.png')",
      'aK': "url('/src/assets/units/aK.png')",
      'aL': "url('/src/assets/units/aL.png')",
      'am': "url('/src/assets/units/am.png')",
      'aS': "url('/src/assets/units/aS.png')",
      'aT': "url('/src/assets/units/aT.png')",
      'oB': "url('/src/assets/units/oB.png')",
      'oR': "url('/src/assets/units/oR.png')",
      'oC': "url('/src/assets/units/oC.png')",
      'oF': "url('/src/assets/units/oF.png')",
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

