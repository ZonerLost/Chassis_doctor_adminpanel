// Dark theme colors
export const DARK_COLORS = {
  bg: "#000000", // full black
  bg2: "#111111", // slightly lighter black
  card: "#1A1A1A", // cards / header
  text: "#FFFFFF", // primary text
  text2: "#AAAAAA", // secondary text
  accent: "#D4AF37", // gold accent
  ring: "rgba(255,255,255,0.15)", // subtle borders
  hover: "#1F1F1F", // hover states
};

// Light theme colors
export const LIGHT_COLORS = {
  bg: "#FFFFFF", // white background
  bg2: "#F8F9FA", // light gray
  card: "#FFFFFF", // white cards
  text: "#1A1A1A", // dark text
  text2: "#6B7280", // secondary gray text
  accent: "#D4AF37", // gold accent (same)
  ring: "rgba(0,0,0,0.1)", // subtle dark borders
  hover: "#F3F4F6", // light hover states
};

// Function to get current theme colors
export const getThemeColors = () => {
  const isDark = localStorage.getItem("theme") !== "light";
  return isDark ? DARK_COLORS : LIGHT_COLORS;
};

// Keep COLORS for backward compatibility with components that haven't been updated yet
export const COLORS = DARK_COLORS;

// CSS variables helper
export const getThemeVars = (isDark = true) => {
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  return `
    :root {
      --bg: ${colors.bg};
      --bg2: ${colors.bg2};
      --card: ${colors.card};
      --text: ${colors.text};
      --text2: ${colors.text2};
      --ring: ${colors.ring};
      --hover: ${colors.hover};
      --accent: ${colors.accent};
    }
  `;
};
