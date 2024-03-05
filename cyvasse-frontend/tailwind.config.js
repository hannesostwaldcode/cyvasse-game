/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        'game-board': "url('/src/assets/Board.png')",
        'game-board-fow': "url('/src/assets/Board_FOW.png')",
        'B': "url('/src/assets/units/oB.png')",
        'R': "url('/src/assets/units/oR.png')",
        'C': "url('/src/assets/units/oC.png')",
        'F': "url('/src/assets/units/oF.png')",
        'D': "url('/src/assets/units/oD.png')",
        'E': "url('/src/assets/units/oE.png')",
        'H': "url('/src/assets/units/oH.png')",
        'K': "url('/src/assets/units/oK.png')",
        'L': "url('/src/assets/units/oL.png')",
        'm': "url('/src/assets/units/om.png')",
        'S': "url('/src/assets/units/oS.png')",
        'T': "url('/src/assets/units/oT.png')",
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
        
      }, 
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}