import "./atoms.css";
export function Button({ variant = "primary", block, children, ...p }) {
  return <button className={`btn btn--${variant} ${block ? "btn--block" : ""}`} {...p}>{children}</button>;
}
