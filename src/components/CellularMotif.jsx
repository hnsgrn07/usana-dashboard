// CellularMotif.jsx
// Abstract cellular illustration used on entry pages (Home, Login,
// Register) — ties visually into USANA's "Cellular Nutrition" identity
// rather than using generic stock-style graphics.
function CellularMotif({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="46" stroke="var(--color-lightblue)" strokeWidth="2" opacity="0.5" />
      <circle cx="45" cy="50" r="26" stroke="var(--color-blue)" strokeWidth="2.5" fill="rgba(0,116,204,0.06)" />
      <circle cx="75" cy="68" r="20" stroke="var(--color-navy)" strokeWidth="2.5" fill="rgba(0,51,133,0.06)" />
      <circle cx="45" cy="50" r="4" fill="var(--color-blue)" />
      <circle cx="75" cy="68" r="4" fill="var(--color-navy)" />
      <circle cx="60" cy="35" r="3" fill="var(--color-lightblue)" />
    </svg>
  );
}

export default CellularMotif;