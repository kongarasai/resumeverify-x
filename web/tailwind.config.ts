import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        background: "#0a0a0f",
        foreground: "#e2e8f0",
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        glass: {
          white: "rgba(255, 255, 255, 0.05)",
          "white-sm": "rgba(255, 255, 255, 0.03)",
          "white-md": "rgba(255, 255, 255, 0.08)",
          "white-lg": "rgba(255, 255, 255, 0.12)",
          border: "rgba(255, 255, 255, 0.1)",
          "border-sm": "rgba(255, 255, 255, 0.06)",
        },
        trust: {
          red: "#ef4444",
          yellow: "#f59e0b",
          blue: "#3b82f6",
          green: "#10b981",
        },
        muted: {
          DEFAULT: "#1e1e2e",
          foreground: "#94a3b8",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          hover: "rgba(255, 255, 255, 0.07)",
        },
        sidebar: {
          DEFAULT: "rgba(10, 10, 20, 0.7)",
          border: "rgba(255, 255, 255, 0.06)",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366f1, #06b6d4)",
        "gradient-secondary": "linear-gradient(135deg, #8b5cf6, #6366f1)",
        "gradient-success": "linear-gradient(135deg, #10b981, #06b6d4)",
        "gradient-card": "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.05))",
        "gradient-radial": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(99, 102, 241, 0.3), 0 0 20px rgba(99, 102, 241, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(99, 102, 241, 0.7), 0 0 50px rgba(99, 102, 241, 0.3)",
          },
        },
        "trust-ring": {
          "0%": { strokeDashoffset: "283" },
          "100%": { strokeDashoffset: "0" },
        },
        "trust-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 6px currentColor)" },
          "50%": { filter: "drop-shadow(0 0 18px currentColor) drop-shadow(0 0 30px currentColor)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        appear: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-left": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "trust-ring": "trust-ring 1.5s ease-out forwards",
        "trust-glow": "trust-glow 2.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s linear infinite",
        appear: "appear 0.4s ease-out",
        "slide-right": "slide-right 0.3s ease-out",
        "slide-left": "slide-left 0.3s ease-out",
        "spin-slow": "spin-slow 8s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "30px",
        "2xl": "40px",
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(99, 102, 241, 0.15)",
        "glow-accent": "0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.15)",
        "glow-success": "0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.15)",
        "glow-error": "0 0 20px rgba(239, 68, 68, 0.4)",
        "glow-warning": "0 0 20px rgba(245, 158, 11, 0.4)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 20px 60px rgba(0, 0, 0, 0.4)",
        "modal": "0 40px 100px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
