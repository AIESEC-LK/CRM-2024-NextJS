/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      scale: [
        "active",
        "group-hover",
        "data-[state=open]",
        "data-[state=closed]",
      ],
      opacity: [
        "active",
        "group-hover",
        "data-[state=open]",
        "data-[state=closed]",
      ],
    },
  },
  plugins: [],
};
