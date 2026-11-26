export function Check({ ok }) {
  return <span className={`check ${ok ? "check--ok" : "check--falta"}`} aria-label={ok ? "Cumples" : "Te falta"}>{ok ? "✓" : "•"}</span>;
}
