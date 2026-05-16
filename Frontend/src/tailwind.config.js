/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        obsidian: {
          950: "#070710",
          900: "#0d0d1a",
          800: "#12121f",
          700: "#1a1a2e",
          600: "#22223b",
        },
        volt: {
          400: "#c8ff00",
          500: "#b0e600",
          600: "#8fba00",
        },
        aurora: {
          pink:   "#ff6b9d",
          blue:   "#4facfe",
          purple: "#a855f7",
          teal:   "#2dd4bf",
        },
      },
      animation: {
        "fade-up":     "fadeUp 0.6s ease forwards",
        "fade-in":     "fadeIn 0.4s ease forwards",
        "pulse-slow":  "pulse 3s ease-in-out infinite",
        "slide-in":    "slideIn 0.3s ease forwards",
        "typing":      "typing 1.2s ease-in-out infinite",
        "glow":        "glow 2s ease-in-out infinite alternate",
        "spin-slow":   "spin 8s linear infinite",
      },
      keyframes: {
        fadeUp:  { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideIn: { "0%": { opacity: 0, transform: "translateX(-16px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
        typing:  { "0%, 100%": { opacity: 0.2 }, "50%": { opacity: 1 } },
        glow:    { "0%": { boxShadow: "0 0 20px rgba(200,255,0,0.1)" }, "100%": { boxShadow: "0 0 40px rgba(200,255,0,0.35)" } },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)",
        "hero-glow":    "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200,255,0,0.15), transparent)",
        "card-glow":    "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,255,0,0.08), transparent)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [],
};
