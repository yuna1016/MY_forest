/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        milk: "#fffdf7",
        cream: "#fffaf0",
        tea: "#8bc07c",
        leaf: "#dff1d9",
        orange: "#f28452",
      },
      fontFamily: {
        hand: [
          "LXGW WenKai",
          "霞鹜文楷",
          "Kaiti SC",
          "KaiTi",
          "PingFang SC",
          "serif",
        ],
        sans: [
          "LXGW WenKai",
          "霞鹜文楷",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
      boxShadow: {
        sketch: "4px 5px 0 #111111",
        soft: "0 18px 44px rgba(17, 17, 17, 0.06)",
      },
    },
  },
  plugins: [],
};
