/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  variants: {
    extend: {
      class: ["rtl"],
    },
  },
  theme: {
    extend: {
      boxShadow: {
        light: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        strong:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        image: "0px 0px 6px -1px #00000080",
      },
      gridTemplateColumns: {
        cards: "repeat(auto-fit, minmax(350px, 1fr))",
      },
      screens: {
        vsm: "370px",
        xlg: "1300px",
        xsm: "500px",
        section: "860px",
      },
      width: {
        "dashboard-sidebar": "250px",
        "dashboard-main": "calc(100% - 250px)",
      },
      height: {
        "dashboard-nav": "55px",
        "dashboard-main": "calc(100vh - 55px)",
      },
      minHeight: {
        "dashboard-nav": "55px",
        "dashboard-main": "calc(100vh - 55px)",
      },
      padding: {
        "dashboard-nav": "55px",
      },
      inset: {
        "dashboard-sidebar": "250px",
        "dashboard-nav": "55px",
      },
      colors: {
        danger: "#E23636",
        secondary: "#669dd4",
        accent: "#1e8bf7",
        background: "#202127",
        "background-light": "#161618",
        gray: {
          1: "#dbdbdb",
          2: "#d2d3d4",
          3: "#a8a8a8",
          4: "#919191",
          5: "#7d7d7d",
        },
      },
    },
  },
  plugins: [],
};
