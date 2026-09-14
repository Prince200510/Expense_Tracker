module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'surface': '#ffffff',
        'surface-container-lowest': '#f8f9fa',
        'surface-container-low': '#f1f3f5',
        'surface-container': '#e9ecef',
        'surface-container-high': '#dee2e6',
        'on-surface': '#212529',
        'on-surface-variant': '#495057',
        'primary': '#845ef7',
        'on-primary': '#ffffff',
        'secondary': '#339af0',
        'on-secondary': '#ffffff',
        'error': '#fa5252',
        'on-error': '#ffffff',
        'outline': '#ced4da',
        'outline-variant': '#e9ecef',
        'scrim': '#000000',
      },
    },
  },
  plugins: [],
}
