module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A1931",
          dark: "#071428"
        },
        accent: {
          DEFAULT: "#00B686",
          dark: "#06d6a0"
        },
        secondary: {
          DEFAULT: "#E8EAF0",
          dark: "#0a1931"
        },
        bg: {
          900: {
            DEFAULT: "#f6f8fb",
            dark: "#071428"
          },
          800: {
            DEFAULT: "#eef4fb",
            dark: "#0a1931"
          }
        },
        panel: {
          DEFAULT: "rgba(2,6,23,0.03)",
          dark: "rgba(255,255,255,0.04)"
        },
        muted: {
          DEFAULT: "rgba(2,6,23,0.6)",
          dark: "rgba(255,255,255,0.6)"
        },
        text: {
          primary: {
            DEFAULT: "#071428",
            dark: "#ffffff"
          },
          onAccent: {
            DEFAULT: "#fff",
            dark: "#03211a"
          }
        }
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        code: ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
