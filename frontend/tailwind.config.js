module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
      colors: {
        "regal-blue": "#243c5a",
        white: "#e6f1ff",
        navy: "#0a192f",
        green: "#64ffda",
        "slate-10": "#a9c5ea",
        "slate-20": "#c3cceb",
        "slate-50": "#cbd5e1",
        "slate-100": "#ccd6f6",
        "slate-200": "#a8b2d1",
        "slate-300": "#8892b0",
        "slate-400": "#495670",
        "dark-navy": "#020c1b",
        "dark-navy-2": "#020c1b",
        "light-navy": "#112240",
        "lightest-navy": "#233554",
        div: "#1e293b",
        button: "#212354",
        light_pink: "#ec4896",
        sky_blue: "#0ea5e9",
        light_yellow: "#fbbf24",
        light_purple: "#c084fc",
        club_div: "#1e293b",
        profile_club_div: "#1e293b",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],

  /**
   * text - 83c5fd
   * text slate - a9c5ea
   *
   *
   */
};
