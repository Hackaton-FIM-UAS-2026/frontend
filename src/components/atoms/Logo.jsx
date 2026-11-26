export function Logo({ light }) {
  return <span className={`logo ${light ? "logo--light" : ""}`}>Camino<span className="logo__dot">.</span></span>;
}
