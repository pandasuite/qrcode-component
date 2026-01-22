const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [require("pandasuite-bridge/tailwind.config")],
  plugins: [
    plugin(({ addComponents }) => {
      addComponents(require("pandasuite-bridge/tailwind.components.config"));
    }),
  ],
};
