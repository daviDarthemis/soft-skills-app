import type { Config } from "tailwindcss"

const config = {
  darkMode: ["selector", '[data-theme="dark"]'],
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
      fontFamily: {
        sans: ["var(--font-nunito)", "ui-rounded", "system-ui", "sans-serif"],
        display: ["var(--font-fredoka)", "var(--font-nunito)", "ui-rounded", "system-ui", "sans-serif"],
      },
      colors: {
        // Marca (igual nos dois temas)
        brand: { DEFAULT: "#7B61FF", 100: "#EFEBFF", 600: "#6A4CF0", 700: "#4B2FC9" },
        sea: { DEFAULT: "#4CC2FF", 100: "#E2F5FF", 700: "#1E96D8" },
        sun: { DEFAULT: "#FFC83D", 100: "#FFF4D1", 700: "#E0A100" },
        coral: { DEFAULT: "#FF6B6B", 100: "#FFE3E3", 600: "#D93A40", 700: "#B02A30" },
        mint: { DEFAULT: "#34D399", 100: "#DBF8EC", 700: "#1FA578" },
        night: "#221C35",
        // Tema (claro/escuro via variáveis em globals.css)
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        panel2: "rgb(var(--panel2) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        soft: "rgb(var(--soft) / <alpha-value>)",
        pop: "rgb(var(--pop) / <alpha-value>)",
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(.85)", opacity: "0" },
          "60%": { transform: "scale(1.06)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        "slide-up": {
          from: { transform: "translateY(105%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(36px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(255,200,61,.65)" },
          "100%": { boxShadow: "0 0 0 16px rgba(255,200,61,0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "page-in": {
          from: { opacity: "0", transform: "translateY(10px) scale(.985)" },
          to: { opacity: "1", transform: "none" },
        },
        nudge: {
          "0%,100%": { transform: "translateY(0) rotate(0)" },
          "40%": { transform: "translateY(-4px) rotate(-8deg)" },
          "70%": { transform: "translateY(0) rotate(4deg)" },
        },
        "icon-pop": {
          "0%": { transform: "scale(.7)" },
          "60%": { transform: "scale(1.18)" },
          "100%": { transform: "scale(1)" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0)", opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0.6" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up .4s cubic-bezier(.22,1,.36,1) both",
        pop: "pop .28s cubic-bezier(.34,1.56,.64,1) both",
        "slide-up": "slide-up .28s cubic-bezier(.22,1,.36,1) both",
        "slide-in": "slide-in .28s cubic-bezier(.22,1,.36,1) both",
        "pulse-ring": "pulse-ring 1.4s ease-out infinite",
        float: "float 3s ease-in-out infinite",
        "page-in": "page-in .32s cubic-bezier(.22,1,.36,1) both",
        nudge: "nudge .5s cubic-bezier(.34,1.56,.64,1)",
        "icon-pop": "icon-pop .4s cubic-bezier(.34,1.56,.64,1)",
        confetti: "confetti 2.5s ease-in forwards",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
} satisfies Config

export default config