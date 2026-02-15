import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        brand: {
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))"
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 8px)"
      },
      fontFamily: {
        sans: ["var(--font-main)", "ui-sans-serif", "system-ui"],
        fa: ["var(--font-fa-family)", "Vazirmatn", "sans-serif"]
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["36px", { lineHeight: "1.25", fontWeight: "700" }],
        h3: ["28px", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["22px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.6", fontWeight: "400" }]
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 23, 42, 0.05)",
        dropdown: "0 14px 38px rgba(15, 23, 42, 0.12)",
        modal: "0 28px 68px rgba(15, 23, 42, 0.2)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in": "fade-in var(--dur-entrance) var(--ease-standard)"
      }
    }
  },
  plugins: []
};

export default config;
