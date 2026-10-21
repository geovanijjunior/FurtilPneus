import type { Config } from "tailwindcss";

// Só os tokens de app/globals.css existem. A paleta default do Tailwind
// é substituída (não estendida) de propósito.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      ink: token("ink"),
      "ink-2": token("ink-2"),
      "ink-3": token("ink-3"),
      paper: token("paper"),
      "paper-2": token("paper-2"),
      line: token("line"),
      "line-dark": token("line-dark"),
      muted: token("muted"),
      "muted-dark": token("muted-dark"),
      signal: token("signal"),
      "signal-deep": token("signal-deep"),
      mercosul: token("mercosul"),
      ok: token("ok"),
      danger: token("danger"),
      white: token("white"),
      whats: token("whats"),
    },
    fontFamily: {
      display: ["var(--font-display)", "system-ui", "sans-serif"],
      sans: ["var(--font-text)", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "ui-monospace", "monospace"],
    },
    extend: {
      maxWidth: { page: "76rem" },
      minHeight: { tap: "44px" },
      minWidth: { tap: "44px" },
      borderRadius: { plate: "0.6rem" },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
        tread: { from: { backgroundPosition: "0 0" }, to: { backgroundPosition: "48px 0" } },
      },
      animation: {
        rise: "rise .35s cubic-bezier(.2,.7,.2,1) both",
        tread: "tread .6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
