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
          light: {
            window: "rgba(255, 255, 255, 0.65)", 
            sidebar: "rgba(245, 245, 247, 0.5)",
            border: "rgba(0, 0, 0, 0.1)",
            text: "#1d1d1f",
            subtext: "#86868b",
            surface: "rgba(255, 255, 255, 0.4)",
            hover: "rgba(0, 0, 0, 0.05)", 
          },
          dark: {
            window: "rgba(30, 30, 32, 0.70)",
            sidebar: "rgba(40, 40, 45, 0.6)",
            border: "rgba(255, 255, 255, 0.12)",
            text: "#f5f5f7",
            subtext: "#a1a1a6",
            surface: "rgba(255, 255, 255, 0.08)",
            hover: "rgba(255, 255, 255, 0.1)", 
          },
          system: {
            blue: "#007AFF",
            red: "#FF3B30",
            green: "#34C759",
            yellow: "#FFCC00",
            gray: "#8E8E93",
          }
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "SF Pro Text", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: {
        'mac-window': '12px', 
        'mac-panel': '10px',
        'mac-btn': '6px',
      },
      boxShadow: {
        'mac-window': '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)', 
        'mac-window-dark': '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
        'mac-dock': '0 10px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
      },
      backdropBlur: {
        'xs': '2px',
        'mac': '20px', 
        'heavy': '50px',
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        'equalizer': {
          '0%, 100%': { height: '4px' },
          '50%': { height: '12px' }
        },
        'mac-pop': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        'spin-slow': 'spin-slow 8s linear infinite',
        'music-bar': 'equalizer 1s ease-in-out infinite',
        'mac-pop': 'mac-pop 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)', 
      }
    },
  },
  plugins: [],
}
export default config