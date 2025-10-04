/** @type {import(''tailwindcss'').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const brandPalette = {
  primary: "#f97316",
  primaryAccent: "#fb923c",
  highlight: "#fbbf24",
  surface: "#fef6f4",
  surfaceSoft: "#fde7e3",
  surfaceStrong: "#f8d0d2",
  neutral: "#374151",
  neutralSoft: "#6B7280",
  border: "#e0e0e0",
  white: "#ffffff",
};

const brandGradients = {
  panel: `linear-gradient(180deg, ${brandPalette.surface} 0%, ${brandPalette.surfaceSoft} 45%, ${brandPalette.surfaceStrong} 100%)`,
  badge: `linear-gradient(135deg, ${brandPalette.primary} 0%, ${brandPalette.primaryAccent} 100%)`,
  highlight: `linear-gradient(135deg, ${brandPalette.highlight} 0%, ${brandPalette.primaryAccent} 100%)`,
};

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      "2xs": "320px",
      xs: "460px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1240px",
      "2xl": "1536px",
      "3xl": "1836px",
      "4xl": "2060px",
    },
    extend: {
      colors: {
        brand: {
          ...brandPalette,
        },
        primary: brandPalette.primary,
        "primary-light": `${brandPalette.primary}20`,
        secondary: brandPalette.highlight,
        "secondary-light": brandPalette.surface,
        "secondary-dark": brandPalette.primaryAccent,
        "secondary-border": `${brandPalette.primary}40`,
        label: "rgba(55, 65, 81, 0.65)",
      },
      backgroundImage: {
        "brand-panel": brandGradients.panel,
        "brand-badge": brandGradients.badge,
        "brand-highlight": brandGradients.highlight,
        "brand-glow": brandGradients.glow,
        "hero-pattern": "url(/assets/banner/bg-shape.webp)",
      },
      boxShadow: {
        "brand-card": "0 32px 80px rgba(244, 163, 181, 0.45)",
        "brand-soft": "0 16px 30px rgba(249, 191, 60, 0.25)",
      },
      gridTemplateColumns: {
        "auto-fill-100": "repeat(auto-fill, minmax(160px, 1fr))",
        "auto-fit-100": "repeat(auto-fit, minmax(100px, 1fr))",
      },
      fontFamily: {
        poppinsLight: ["Poppins-Light", "sans-serif"],
        poppinsBold: ["Poppins-Bold", "sans-serif"],
        poppins: ["Poppins-Medium", "sans-serif"],
        Roboto: ["Roboto-Medium", "sans-serif"],
        RobotoLight: ["Roboto-Light", "sans-serif"],
        RobotoBold: ["Roboto-Bold", "sans-serif"],
      },
    },
  },
  plugins: [
    require("daisyui"),
    ({ addBase }) => {
      addBase({
        ":root": {
          "--brand-primary": brandPalette.primary,
          "--brand-primary-accent": brandPalette.primaryAccent,
          "--brand-highlight": brandPalette.highlight,
          "--brand-surface": brandPalette.surface,
          "--brand-surface-soft": brandPalette.surfaceSoft,
          "--brand-surface-strong": brandPalette.surfaceStrong,
          "--brand-neutral": brandPalette.neutral,
          "--brand-neutral-soft": brandPalette.neutralSoft,
          "--brand-border": brandPalette.border,
          "--brand-white": brandPalette.white,
          "--gradient-brand-panel": brandGradients.panel,
          "--gradient-brand-badge": brandGradients.badge,
          "--gradient-brand-highlight": brandGradients.highlight,
          "--gradient-brand-glow": brandGradients.glow,
          "--shadow-brand-card": "0 32px 80px rgba(244, 163, 181, 0.45)",
        },
      });
    },
  ],
};
