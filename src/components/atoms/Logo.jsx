export function Logo({ light }) {
  return <span className={`logo ${light ? "logo--light" : ""}`}>Empoderate<span className="logo__dot">.</span></span>;
}
