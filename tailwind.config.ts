import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mac: {
          // Chuẩn hóa Light Mode Colors
          light: {
            window: "rgba(255, 255, 255, 0.75)",
            sidebar: "rgba(255, 255, 255, 0.5)",
            border: "rgba(0, 0, 0, 0.1)",
            text: "#1d1d1f",
            subtext: "#86868b",
            surface: "rgba(255, 255, 255, 0.8)",
          },
          // Thêm Dark Mode Colors 
          dark: {
            window: "rgba(29, 29, 31, 0.85)",
            sidebar: "rgba(35, 35, 38, 0.6)",
            border: "rgba(255, 255, 255, 0.1)",
            text: "#ffffff",
            subtext: "#a1a1a6",
            surface: "rgba(40, 40, 43, 0.9)",
          },
          systemBlue: "#007AFF",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        'mac-window': '0 10px 30px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)',
        'mac-btn': '0 1px 2px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}
export default config