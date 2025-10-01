export const fmtInt = (n) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n || 0);

export const fmtFloat = (n, d = 1) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(n || 0);

export const fmtCurrency = (n, c = undefined) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: c || "USD",
  }).format(n || 0);

export const pct = (n) => `${n > 0 ? "+" : ""}${fmtFloat(n, 1)}%`;

export const since = (iso) => {
  try {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch {
    return "-";
  }
};
