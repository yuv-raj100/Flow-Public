
// tailwind.config.js

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#212121",
        DetailsBg: "#90EE90",
        GreenColor: "#47CF73",
        BlueColor: "#3A81F1",
      },
    },
  },
  plugins: [],
};