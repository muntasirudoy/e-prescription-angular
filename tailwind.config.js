/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      "2xs": "320px",
      // min 320 max 575px
      xs: "460px",

      sm: "576px",
      // => @media (min-width: 576px max 767px) { ... }

      md: "768px",
      // => @media (min-width: 768px max 991px) { ... }

      lg: "992px",
      // => @media (min-width: 992px max 1239px) { ... }

      xl: "1240px",
      // => @media (min-width: 1240px 1535px) { ... }

      "2xl": "1536px",

      "3xl": "1836px",

      "4xl": "2060px",

      // => @media (min-width: 1536px) { ... }
    },

    extend: {
      backgroundImage: {
        "hero-pattern": "url(/assets/banner/bg-shape.webp)",
        // 'auth-pattern' :"url('/assets/')
      },
      gridTemplateColumns: {
        "auto-fill-100": "repeat(auto-fill, minmax(160px, 1fr))",
        "auto-fit-100": "repeat(auto-fit, minmax(100px, 1fr))",
      },
      boxShadow: {
        soft: "rgba(0, 0, 0, 0.06) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        high: "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        bottom:
          "rgba(0, 0, 0, 0.09) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
        blue: "rgba(84, 87, 172, 0.2) 0px 7px 29px 0px",
      },
      colors: {
        primary: "#f4c1c8",
        "primary-light": "#f4c1c820",
        secondary: "#fbbf24",
        "secondary-light": "#fde68a",
        "secondary-dark": "#f97316",
        "secondary-border": "#f4c1c840",
        label: "rgba(0, 0, 0, 0.6)",
        skyblue: "#fbbf24",

        gray: {
          100: "#f7fafc",
          // ...
          900: "#1a202c",
        },
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

  plugins: [require("daisyui")],
};


