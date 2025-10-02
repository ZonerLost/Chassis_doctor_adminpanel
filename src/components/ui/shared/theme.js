export const DARK_COLORS = {
  bg: "#0B0B0F",
  bg2: "#12131A",
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  gold: "#D4AF37",
  purple: "#6E56CF",
  ring: "rgba(110,86,207,0.25)",
  accent: "#D4AF37",
  hover: "rgba(110,86,207,0.1)",
  ok: "#22C55E",
  warn: "#F59E0B",
  danger: "#EF4444",
};

export const LIGHT_COLORS = {
  bg: "#FFFFFF",
  bg2: "#F8F9FA",
  card: "#FFFFFF",
  text: "#1F2937",
  text2: "#6B7280",
  gold: "#D4AF37",
  purple: "#6E56CF",
  ring: "rgba(110,86,207,0.15)",
  accent: "#D4AF37",
  hover: "rgba(110,86,207,0.05)",
  ok: "#22C55E",
  warn: "#F59E0B",
  danger: "#EF4444",
};

export const getThemeVars = (isDark) => {
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return `
    :root {
      --color-bg: ${colors.bg};
      --color-bg2: ${colors.bg2};
      --color-card: ${colors.card};
      --color-text: ${colors.text};
      --color-text2: ${colors.text2};
      --color-gold: ${colors.gold};
      --color-purple: ${colors.purple};
      --color-ring: ${colors.ring};
      --color-accent: ${colors.accent};
      --color-hover: ${colors.hover};
      --color-ok: ${colors.ok};
      --color-warn: ${colors.warn};
      --color-danger: ${colors.danger};
    }
  `;
};

// Alternative theme structure for backward compatibility
export const themes = {
  dark: {
    bg: "#1a1a1a",
    surface: "#2a2a2a",
    surfaceHover: "#3a3a3a",
    border: "#3a3a3a",
    text: "#ffffff",
    textSecondary: "#a1a1a1",
    accent: "#6366f1",
    danger: "#ef4444",
    warning: "#f59e0b",
    success: "#10b981",
  },
  light: {
    bg: "#ffffff",
    surface: "#f8f9fa",
    surfaceHover: "#e9ecef",
    border: "#e9ecef",
    text: "#1a1a1a",
    textSecondary: "#6c757d",
    accent: "#6366f1",
    danger: "#dc3545",
    warning: "#ffc107",
    success: "#198754",
  },
};

// Function to get current theme colors
export const getThemeColors = () => {
  const isDark = localStorage.getItem("theme") !== "light";
  return isDark ? DARK_COLORS : LIGHT_COLORS;
};

// Keep COLORS for backward compatibility
export const COLORS = DARK_COLORS;
