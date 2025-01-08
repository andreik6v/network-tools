/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        muted: "rgb(241 245 249)",
      },
      textColor: {
        "muted-foreground": "rgb(100 116 139)",
      },
    },
  },
  plugins: [],
};
