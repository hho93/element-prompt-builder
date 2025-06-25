import { type Config } from "tailwindcss";
import plugin, { type PluginAPI } from "tailwindcss/plugin";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class", "dark"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        md: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1.5rem",
      },
      center: true,
    },
    extend: {
      animation: {
        "ping-slow": "ping 0.65s linear infinite",
      },
      screens: {
        "2xl": "1440px",
        "3xl": "1920px",
        "4xl": "2560px",

      },
      colors: {
        white: "#FFF",
        "primary-green": "#44BD8A",
        "primary-blue": "#8DC5D7",
        "primary-gray": "#F7F8FA",
        "primary-orange": "#FFDEBF",
        "light-brown": "#DAA06D",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("slider-thumb", [
        "&::-webkit-slider-thumb",
        "&::slider-thumb",
      ]);
    }),
    function ({ addComponents }: PluginAPI) {
      addComponents({
        ".container": {
          maxWidth: "100%",
          paddingRight: "30px",
          paddingLeft: "30px",
          margin: "0 auto",

          "@screen sm": {
            maxWidth: "640px",
            paddingRight: "30px",
            paddingLeft: "30px",
          },
          "@screen md": {
            maxWidth: "768px",
            paddingRight: "30px",
            paddingLeft: "30px",
          },
          "@screen lg": {
            maxWidth: "1280px",
            paddingRight: "0.75rem",
            paddingLeft: "0.75rem",
          },
          "@screen xl": {
            maxWidth: "1350px",
            paddingRight: "1.25rem",
            paddingLeft: "1.25rem",
          },
          "@screen 2xl": {
            maxWidth: "1680px",
            paddingRight: "1.5rem",
            paddingLeft: "1.5rem",
          },
          "@screen 3xl": {
            maxWidth: "1920px",
            paddingRight: "2rem",
            paddingLeft: "2rem",
          },
          "@screen 4xl": {
            maxWidth: "2400px",
            paddingRight: "2.5rem",
            paddingLeft: "2.5rem",
          },
        },
      });
    },
    tailwindcssAnimate,
  ],
} satisfies Config;
